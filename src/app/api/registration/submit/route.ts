import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireSignature } from "@/lib/registrationGuard";
import { errorResponse, ApiError } from "@/lib/apiError";
import { prisma } from "@/lib/db";
import { CURRENT_AGREEMENT_VERSION } from "@/lib/config";
import { generateAgreementPdf } from "@/lib/pdf/generateAgreementPdf";
import { generateAgreementDocx } from "@/lib/docx/generateAgreementDocx";
import { readPrivateFile, savePrivateFile } from "@/lib/storage";
import { sha256Hex, generateAgreementId } from "@/lib/crypto";
import { logAudit, getClientIp } from "@/lib/audit";
import { sendAgreementEmails, maskMobile } from "@/lib/notify";

export async function POST(_req: NextRequest) {
  try {
    const user = await requireSignature();

    const existingAgreement = await prisma.agreement.findUnique({ where: { userId: user.id } });
    if (existingAgreement?.status && existingAgreement.status !== "IN_PROGRESS") {
      return NextResponse.json({
        success: true,
        agreementId: existingAgreement.id,
        alreadySubmitted: true,
      });
    }

    if (!user.signature) {
      throw new ApiError(403, "Signature is required.", "SIGNATURE_MISSING");
    }

    const ip = getClientIp(await headers());
    const agreementId = generateAgreementId();

    const signatureBytes = await readPrivateFile(user.signature.signatureStoragePath);

    const agreementInput = {
      agreementId,
      agreementVersion: CURRENT_AGREEMENT_VERSION,
      fullName: user.signature.fullLegalName || user.fullName || "",
      email: user.email || "",
      mobileMasked: maskMobile(user.mobile),
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : "",
      termsVersion: user.consent?.termsVersion ?? CURRENT_AGREEMENT_VERSION,
      privacyVersion: user.consent?.privacyVersion ?? CURRENT_AGREEMENT_VERSION,
      riskVersion: user.consent?.riskVersion ?? CURRENT_AGREEMENT_VERSION,
      signedAt: user.signature.signedAt,
      signatureImageBytes: signatureBytes,
      documentHash: user.signature.documentHash,
      ipAddress: ip,
    };

    // The signed PDF is the tamper-evident document of record; the .docx is an
    // additional editable copy generated from the same input for convenience.
    const [pdfBuffer, docxBuffer] = await Promise.all([
      generateAgreementPdf(agreementInput),
      generateAgreementDocx(agreementInput),
    ]);

    const pdfHash = sha256Hex(pdfBuffer);
    const docxHash = sha256Hex(docxBuffer);
    const [{ storagePath }, { storagePath: docxStoragePath }] = await Promise.all([
      savePrivateFile("agreements", pdfBuffer, "pdf"),
      savePrivateFile("agreements", docxBuffer, "docx"),
    ]);

    const now = new Date();

    await prisma.agreement.upsert({
      where: { userId: user.id },
      create: {
        id: agreementId,
        userId: user.id,
        agreementVersion: CURRENT_AGREEMENT_VERSION,
        pdfStoragePath: storagePath,
        pdfDocumentHash: pdfHash,
        docxStoragePath,
        docxDocumentHash: docxHash,
        status: "PENDING_REVIEW",
        submittedAt: now,
      },
      update: {
        pdfStoragePath: storagePath,
        pdfDocumentHash: pdfHash,
        docxStoragePath,
        docxDocumentHash: docxHash,
        status: "PENDING_REVIEW",
        submittedAt: now,
      },
    });

    await logAudit({ userId: user.id, actorType: "student", action: "agreement_submitted", metadata: { agreementId }, ipAddress: ip });
    await sendAgreementEmails({
      agreementId,
      studentName: user.fullName ?? "Unknown",
      studentEmail: user.email,
      pdfBuffer,
    });

    return NextResponse.json({ success: true, agreementId });
  } catch (err) {
    return errorResponse(err);
  }
}
