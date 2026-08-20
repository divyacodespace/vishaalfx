import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { errorResponse, ApiError } from "@/lib/apiError";
import { readPrivateFile } from "@/lib/storage";
import { logAudit, getClientIp } from "@/lib/audit";

// Admin-only, authorization-checked-on-every-request download of the editable
// .docx copy of the enrollment agreement. The PDF (see .../pdf/route.ts) is the
// tamper-evident document of record; this is a convenience copy. Never served
// from a public path or predictable URL.
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const admin = await requireAdmin();

    const agreement = await prisma.agreement.findUnique({ where: { id } });
    if (!agreement || !agreement.docxStoragePath) {
      throw new ApiError(404, "Agreement .docx copy not found.");
    }

    const bytes = await readPrivateFile(agreement.docxStoragePath);

    await logAudit({
      userId: agreement.userId,
      actorType: "admin",
      actorId: admin.adminId,
      action: "agreement_docx_downloaded",
      metadata: { agreementId: agreement.id },
      ipAddress: getClientIp(await headers()),
    });

    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="VishaalFX-Agreement-${agreement.id}.docx"`,
        "Cache-Control": "no-store, private",
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
