import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { errorResponse, ApiError } from "@/lib/apiError";
import { rejectEnrollmentSchema } from "@/lib/validation";
import { logAudit, getClientIp } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const parsed = rejectEnrollmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });
    }

    const agreement = await prisma.agreement.findUnique({ where: { id } });
    if (!agreement) throw new ApiError(404, "Enrollment not found.");

    const now = new Date();
    await prisma.agreement.update({
      where: { id: agreement.id },
      data: { status: "REJECTED", rejectedAt: now, rejectedBy: admin.adminId, rejectionReason: parsed.data.reason },
    });

    await logAudit({
      userId: agreement.userId,
      actorType: "admin",
      actorId: admin.adminId,
      action: "enrollment_rejected",
      metadata: { agreementId: agreement.id, reason: parsed.data.reason },
      ipAddress: getClientIp(await headers()),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
