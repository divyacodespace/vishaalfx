import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { errorResponse, ApiError } from "@/lib/apiError";
import { logAudit, getClientIp } from "@/lib/audit";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const admin = await requireAdmin();

    const agreement = await prisma.agreement.findUnique({
      where: { id },
      include: { user: { include: { consent: true, signature: true } } },
    });
    if (!agreement) throw new ApiError(404, "Enrollment not found.");

    const u = agreement.user;
    const allConditionsMet =
      !!u.fullName &&
      !!u.email &&
      !!u.consent?.termsAccepted &&
      !!u.consent?.privacyAccepted &&
      !!u.consent?.riskAccepted &&
      !!u.consent?.finalConsentAt &&
      !!u.signature;

    if (!allConditionsMet) {
      throw new ApiError(400, "Cannot approve: not all enrollment requirements have been completed.", "REQUIREMENTS_NOT_MET");
    }

    const now = new Date();
    await prisma.agreement.update({
      where: { id: agreement.id },
      data: { status: "APPROVED", approvedAt: now, approvedBy: admin.adminId, rejectedAt: null, rejectedBy: null, rejectionReason: null },
    });

    await logAudit({
      userId: u.id,
      actorType: "admin",
      actorId: admin.adminId,
      action: "enrollment_approved",
      metadata: { agreementId: agreement.id },
      ipAddress: getClientIp(await headers()),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
