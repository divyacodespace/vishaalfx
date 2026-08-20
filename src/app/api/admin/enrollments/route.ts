import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { errorResponse } from "@/lib/apiError";
import { maskMobile } from "@/lib/notify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      where: { agreement: { isNot: null } },
      include: { consent: true, signature: true, agreement: true },
      orderBy: { createdAt: "desc" },
    });

    const rows = users.map((u) => ({
      userId: u.id,
      agreementId: u.agreement?.id,
      studentName: u.fullName,
      mobile: maskMobile(u.mobile),
      termsAccepted: !!u.consent?.termsAccepted,
      privacyAccepted: !!u.consent?.privacyAccepted,
      riskAccepted: !!u.consent?.riskAccepted,
      signatureCompleted: !!u.signature,
      status: u.agreement?.status,
      submittedDate: u.agreement?.submittedAt,
    }));

    return NextResponse.json({ enrollments: rows });
  } catch (err) {
    return errorResponse(err);
  }
}
