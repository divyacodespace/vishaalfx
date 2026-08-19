import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getOrCreateSessionUser } from "@/lib/registrationGuard";
import { errorResponse } from "@/lib/apiError";
import { studentDetailsSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { logAudit, getClientIp } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateSessionUser();
    const body = await req.json();
    const parsed = studentDetailsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
    }

    const dob = new Date(parsed.data.dateOfBirth);
    const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (age < 18) {
      return NextResponse.json(
        { error: "The date of birth provided indicates you are under 18. You are not eligible to enroll." },
        { status: 403 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        dateOfBirth: dob,
        city: parsed.data.city || null,
        institution: parsed.data.institution || null,
        occupation: parsed.data.occupation || null,
        countryCode: parsed.data.countryCode || null,
        mobile: parsed.data.mobile || null,
      },
    });

    await logAudit({ userId: user.id, actorType: "student", action: "details_submitted", ipAddress: getClientIp(await headers()) });

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
