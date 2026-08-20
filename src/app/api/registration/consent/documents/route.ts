import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireDetailsComplete } from "@/lib/registrationGuard";
import { errorResponse } from "@/lib/apiError";
import { consentDocumentsSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { CURRENT_PRIVACY_VERSION, CURRENT_RISK_VERSION, CURRENT_TERMS_VERSION } from "@/lib/config";
import { logAudit, getClientIp } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await requireDetailsComplete();
    const body = await req.json();
    const parsed = consentDocumentsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "All documents must be accepted." }, { status: 400 });
    }
    const requestHeaders = await headers();
    const ip = getClientIp(requestHeaders);
    const userAgent = requestHeaders.get("user-agent");
    const now = new Date();

    await prisma.consent.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        termsVersion: CURRENT_TERMS_VERSION,
        termsAccepted: true,
        termsAcceptedAt: now,
        privacyVersion: CURRENT_PRIVACY_VERSION,
        privacyAccepted: true,
        privacyAcceptedAt: now,
        riskVersion: CURRENT_RISK_VERSION,
        riskAccepted: true,
        riskAcceptedAt: now,
        ipAddress: ip ?? undefined,
        userAgent: userAgent ?? undefined,
      },
      update: {
        termsVersion: CURRENT_TERMS_VERSION,
        termsAccepted: true,
        termsAcceptedAt: now,
        privacyVersion: CURRENT_PRIVACY_VERSION,
        privacyAccepted: true,
        privacyAcceptedAt: now,
        riskVersion: CURRENT_RISK_VERSION,
        riskAccepted: true,
        riskAcceptedAt: now,
        ipAddress: ip ?? undefined,
        userAgent: userAgent ?? undefined,
      },
    });

    await logAudit({ userId: user.id, actorType: "student", action: "documents_accepted", ipAddress: ip });

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
