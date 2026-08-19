import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireDocumentsAccepted } from "@/lib/registrationGuard";
import { errorResponse } from "@/lib/apiError";
import { finalConsentSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { logAudit, getClientIp } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await requireDocumentsAccepted();
    const body = await req.json();
    const parsed = finalConsentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "All confirmations are required to continue." }, { status: 400 });
    }
    const ip = getClientIp(await headers());

    await prisma.consent.update({
      where: { userId: user.id },
      data: { finalConsentAt: new Date() },
    });

    await logAudit({ userId: user.id, actorType: "student", action: "final_consent_confirmed", ipAddress: ip });

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
