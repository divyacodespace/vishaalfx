import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { errorResponse, ApiError } from "@/lib/apiError";
import { maskMobile } from "@/lib/notify";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await requireAdmin();

    const agreement = await prisma.agreement.findUnique({
      where: { id },
      include: {
        user: { include: { consent: true, signature: true } },
      },
    });

    if (!agreement) throw new ApiError(404, "Enrollment not found.");

    const u = agreement.user;
    return NextResponse.json({
      agreementId: agreement.id,
      status: agreement.status,
      submittedAt: agreement.submittedAt,
      approvedAt: agreement.approvedAt,
      rejectedAt: agreement.rejectedAt,
      rejectionReason: agreement.rejectionReason,
      student: {
        fullName: u.fullName,
        email: u.email,
        mobile: maskMobile(u.mobile),
        city: u.city,
        institution: u.institution,
        occupation: u.occupation,
        dateOfBirth: u.dateOfBirth,
      },
      consent: u.consent,
      signature: u.signature ? { fullLegalName: u.signature.fullLegalName, signedAt: u.signature.signedAt } : null,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
