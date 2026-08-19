import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireFinalConsent } from "@/lib/registrationGuard";
import { errorResponse } from "@/lib/apiError";
import { signatureSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { savePrivateFile } from "@/lib/storage";
import { sha256Hex } from "@/lib/crypto";
import { logAudit, getClientIp } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await requireFinalConsent();
    const body = await req.json();
    const parsed = signatureSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid signature." }, { status: 400 });
    }

    const base64 = parsed.data.signatureDataUrl.split(",")[1] ?? "";
    const buffer = Buffer.from(base64, "base64");
    if (buffer.length < 100) {
      return NextResponse.json({ error: "Signature appears to be empty. Please draw your signature." }, { status: 400 });
    }

    const documentHash = sha256Hex(buffer);
    const { storagePath } = await savePrivateFile("signatures", buffer, "png");

    const requestHeaders = await headers();
    const ip = getClientIp(requestHeaders);
    const userAgent = requestHeaders.get("user-agent");

    await prisma.signature.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        fullLegalName: parsed.data.fullLegalName,
        signatureStoragePath: storagePath,
        documentHash,
        ipAddress: ip ?? undefined,
        userAgent: userAgent ?? undefined,
      },
      update: {
        fullLegalName: parsed.data.fullLegalName,
        signatureStoragePath: storagePath,
        documentHash,
        signedAt: new Date(),
        ipAddress: ip ?? undefined,
        userAgent: userAgent ?? undefined,
      },
    });

    await logAudit({ userId: user.id, actorType: "student", action: "signature_captured", ipAddress: ip });

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
