import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { business } from "../config";

export interface AgreementPdfInput {
  agreementId: string;
  agreementVersion: string;
  fullName: string;
  email: string;
  mobileMasked: string;
  dateOfBirth: string;
  termsVersion: string;
  privacyVersion: string;
  riskVersion: string;
  signedAt: Date;
  signatureImageBytes: Buffer;
  documentHash: string;
  ipAddress: string | null;
}

const PAGE_MARGIN = 50;

export async function generateAgreementPdf(input: AgreementPdfInput): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("VishaalFX — Student Enrollment & Consent Agreement");
  pdfDoc.setSubject(`Agreement ${input.agreementId}`);
  pdfDoc.setProducer("VishaalFX Enrollment System");

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  let cursorY = page.getHeight() - PAGE_MARGIN;
  const pageWidth = page.getWidth();
  const textWidth = pageWidth - PAGE_MARGIN * 2;

  function newPageIfNeeded(neededSpace: number) {
    if (cursorY - neededSpace < PAGE_MARGIN) {
      page = pdfDoc.addPage([595.28, 841.89]);
      cursorY = page.getHeight() - PAGE_MARGIN;
    }
  }

  function drawHeading(text: string, size = 14) {
    newPageIfNeeded(size + 10);
    page.drawText(text, { x: PAGE_MARGIN, y: cursorY, size, font: bold, color: rgb(0.05, 0.1, 0.2) });
    cursorY -= size + 8;
  }

  function drawParagraph(text: string, size = 10) {
    const words = text.split(" ");
    const maxCharsPerLine = Math.floor(textWidth / (size * 0.5));
    let line = "";
    const lines: string[] = [];
    for (const word of words) {
      if ((line + " " + word).trim().length > maxCharsPerLine) {
        lines.push(line.trim());
        line = word;
      } else {
        line = `${line} ${word}`;
      }
    }
    if (line.trim()) lines.push(line.trim());

    for (const l of lines) {
      newPageIfNeeded(size + 4);
      page.drawText(l, { x: PAGE_MARGIN, y: cursorY, size, font, color: rgb(0.15, 0.15, 0.18) });
      cursorY -= size + 4;
    }
    cursorY -= 4;
  }

  function drawKeyValue(key: string, value: string) {
    newPageIfNeeded(14);
    page.drawText(key, { x: PAGE_MARGIN, y: cursorY, size: 10, font: bold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(value, { x: PAGE_MARGIN + 170, y: cursorY, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    cursorY -= 16;
  }

  // Header / branding
  page.drawText("VishaalFX", { x: PAGE_MARGIN, y: cursorY, size: 22, font: bold, color: rgb(0.02, 0.6, 0.65) });
  cursorY -= 26;
  drawHeading("Student Enrollment & Consent Agreement", 13);
  drawParagraph(`Agreement ID: ${input.agreementId}  |  Version: ${input.agreementVersion}`, 9);

  cursorY -= 6;
  drawHeading("Student Details");
  drawKeyValue("Full Name:", input.fullName);
  drawKeyValue("Email:", input.email);
  drawKeyValue("Mobile:", input.mobileMasked);
  drawKeyValue("Date of Birth:", input.dateOfBirth);
  drawKeyValue("Age Eligibility:", "Confirmed 18+ (self-declared, server-recorded)");

  cursorY -= 6;
  drawHeading("Acknowledgements");
  drawParagraph(
    `The student has read, understood, and electronically accepted the following documents. Full document text is available at the time of enrollment and is versioned below.`
  );
  drawKeyValue("Terms & Conditions:", `Accepted (v${input.termsVersion})`);
  drawKeyValue("Privacy Policy:", `Accepted (v${input.privacyVersion})`);
  drawKeyValue("Trading Risk Disclosure:", `Accepted (v${input.riskVersion})`);
  drawParagraph(
    "The student acknowledges that trading and financial markets involve significant risk of loss, and that VishaalFX does not guarantee profits, returns, income, employment, or financial success.",
    10
  );

  cursorY -= 6;
  drawHeading("Electronic Signature");
  drawKeyValue("Signed By:", input.fullName);
  drawKeyValue("Signed At:", input.signedAt.toISOString());
  drawKeyValue("IP Address:", input.ipAddress ?? "unknown");

  newPageIfNeeded(140);
  try {
    const pngImage = await pdfDoc.embedPng(input.signatureImageBytes);
    const scaled = pngImage.scaleToFit(220, 90);
    page.drawRectangle({
      x: PAGE_MARGIN,
      y: cursorY - scaled.height - 8,
      width: scaled.width + 16,
      height: scaled.height + 16,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 1,
    });
    page.drawImage(pngImage, { x: PAGE_MARGIN + 8, y: cursorY - scaled.height, width: scaled.width, height: scaled.height });
    cursorY -= scaled.height + 26;
  } catch {
    drawParagraph("[Signature image unavailable]");
  }

  cursorY -= 10;
  drawHeading("Audit Information", 11);
  drawParagraph(
    `This document was generated automatically by the VishaalFX enrollment system upon successful completion of student detail collection and electronic consent to the Terms & Conditions, Privacy Policy, and Trading Risk Disclosure. Document integrity hash (SHA-256): ${input.documentHash}`,
    8
  );
  drawParagraph(
    `Note: this is a system-captured electronic signature, not a government-issued Digital Signature Certificate (DSC). Where a legally recognized e-signature is required, a compliant third-party e-sign provider should be integrated.`,
    8
  );

  // Footer on every page
  const pages = pdfDoc.getPages();
  pages.forEach((p, idx) => {
    p.drawText(
      `${business.legalName} — Confidential — Page ${idx + 1} of ${pages.length}`,
      { x: PAGE_MARGIN, y: 25, size: 7, font, color: rgb(0.5, 0.5, 0.5) }
    );
  });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
