import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { errorResponse, ApiError } from "@/lib/apiError";
import { readPrivateFile } from "@/lib/storage";
import { logAudit, getClientIp } from "@/lib/audit";

// Admin-only, authorization-checked-on-every-request download of the signed
// enrollment PDF. Never served from a public path or predictable URL.
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const admin = await requireAdmin();

    const agreement = await prisma.agreement.findUnique({ where: { id } });
    if (!agreement || !agreement.pdfStoragePath) {
      throw new ApiError(404, "Signed agreement not found.");
    }

    const bytes = await readPrivateFile(agreement.pdfStoragePath);

    await logAudit({
      userId: agreement.userId,
      actorType: "admin",
      actorId: admin.adminId,
      action: "agreement_pdf_downloaded",
      metadata: { agreementId: agreement.id },
      ipAddress: getClientIp(await headers()),
    });

    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="VishaalFX-Agreement-${agreement.id}.pdf"`,
        "Cache-Control": "no-store, private",
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
