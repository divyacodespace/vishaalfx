import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { STUDENT_SESSION_COOKIE, verifyStudentToken } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = (await cookies()).get(STUDENT_SESSION_COOKIE)?.value;
  const payload = token ? verifyStudentToken(token) : null;
  if (!payload) {
    return NextResponse.json({ authenticated: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { consent: true, signature: true, agreement: true },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    mobile: user.mobile,
    countryCode: user.countryCode,
    detailsComplete: !!(user.fullName && user.email && user.dateOfBirth),
    fullName: user.fullName,
    email: user.email,
    documentsAccepted: !!(user.consent?.termsAccepted && user.consent?.privacyAccepted && user.consent?.riskAccepted),
    finalConsentGiven: !!user.consent?.finalConsentAt,
    signatureComplete: !!user.signature,
    agreementStatus: user.agreement?.status ?? null,
    agreementId: user.agreement?.id ?? null,
  });
}
