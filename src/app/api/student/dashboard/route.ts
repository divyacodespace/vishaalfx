import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { STUDENT_SESSION_COOKIE, verifyStudentToken } from "@/lib/session";

export async function GET() {
  const token = (await cookies()).get(STUDENT_SESSION_COOKIE)?.value;
  const payload = token ? verifyStudentToken(token) : null;
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { agreement: true },
  });
  if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({
    authenticated: true,
    fullName: user.fullName,
    agreementStatus: user.agreement?.status ?? null,
    approvedAt: user.agreement?.approvedAt ?? null,
    rejectionReason: user.agreement?.rejectionReason ?? null,
  });
}
