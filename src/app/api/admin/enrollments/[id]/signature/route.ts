import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { errorResponse, ApiError } from "@/lib/apiError";
import { readPrivateFile } from "@/lib/storage";
import { logAudit, getClientIp } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const admin = await requireAdmin();

    const agreement = await prisma.agreement.findUnique({ where: { id }, include: { user: { include: { signature: true } } } });
    if (!agreement || !agreement.user.signature) {
      throw new ApiError(404, "Signature not found.");
    }

    const bytes = await readPrivateFile(agreement.user.signature.signatureStoragePath);

    await logAudit({
      userId: agreement.userId,
      actorType: "admin",
      actorId: admin.adminId,
      action: "signature_image_viewed",
      metadata: { agreementId: agreement.id },
      ipAddress: getClientIp(await headers()),
    });

    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store, private" },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
