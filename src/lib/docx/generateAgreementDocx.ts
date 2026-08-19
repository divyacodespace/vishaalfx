import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import { business } from "../config";

export interface AgreementDocxInput {
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

function heading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: "0D1A33" })],
  });
}

function body(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 20, color: "26262E" })],
  });
}

function keyValue(key: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({ text: `${key} `, bold: true, size: 20 }),
      new TextRun({ text: value, size: 20 }),
    ],
  });
}

export async function generateAgreementDocx(input: AgreementDocxInput): Promise<Buffer> {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      children: [new TextRun({ text: "VishaalFX", bold: true, size: 44, color: "059AA6" })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 60 },
      children: [new TextRun({ text: "Student Enrollment & Consent Agreement", bold: true })],
    }),
    body(`Agreement ID: ${input.agreementId}  |  Version: ${input.agreementVersion}`)
  );

  children.push(heading("Student Details"));
  children.push(
    keyValue("Full Name:", input.fullName),
    keyValue("Email:", input.email),
    keyValue("Mobile:", input.mobileMasked),
    keyValue("Date of Birth:", input.dateOfBirth),
    keyValue("Age Eligibility:", "Confirmed 18+ (self-declared, server-recorded)")
  );

  children.push(heading("Acknowledgements"));
  children.push(
    body(
      "The student has read, understood, and electronically accepted the following documents. Full document text is available at the time of enrollment and is versioned below."
    ),
    keyValue("Terms & Conditions:", `Accepted (v${input.termsVersion})`),
    keyValue("Privacy Policy:", `Accepted (v${input.privacyVersion})`),
    keyValue("Trading Risk Disclosure:", `Accepted (v${input.riskVersion})`),
    body(
      "The student acknowledges that trading and financial markets involve significant risk of loss, and that VishaalFX does not guarantee profits, returns, income, employment, or financial success."
    )
  );

  children.push(heading("Electronic Signature"));
  children.push(
    keyValue("Signed By:", input.fullName),
    keyValue("Signed At:", input.signedAt.toISOString()),
    keyValue("IP Address:", input.ipAddress ?? "unknown")
  );

  try {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 240 },
        border: {
          top: { style: BorderStyle.SINGLE, size: 4, color: "B3B3B3" },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: "B3B3B3" },
          left: { style: BorderStyle.SINGLE, size: 4, color: "B3B3B3" },
          right: { style: BorderStyle.SINGLE, size: 4, color: "B3B3B3" },
        },
        children: [
          new ImageRun({
            type: "png",
            data: input.signatureImageBytes,
            transformation: { width: 220, height: 90 },
          }),
        ],
      })
    );
  } catch {
    children.push(body("[Signature image unavailable]"));
  }

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 120, after: 80 },
      children: [new TextRun({ text: "Audit Information", bold: true })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `This document was generated automatically by the VishaalFX enrollment system upon successful completion of student detail collection and electronic consent to the Terms & Conditions, Privacy Policy, and Trading Risk Disclosure. Document integrity hash (SHA-256): ${input.documentHash}`,
          size: 16,
          italics: true,
          color: "666666",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "Note: this is a system-captured electronic signature, not a government-issued Digital Signature Certificate (DSC). Where a legally recognized e-signature is required, a compliant third-party e-sign provider should be integrated. This .docx copy is provided for convenience/record-keeping only — the signed PDF is the tamper-evident document of record.",
          size: 16,
          italics: true,
          color: "666666",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${business.legalName} — Confidential`,
          size: 14,
          color: "808080",
        }),
      ],
    })
  );

  const doc = new Document({
    title: "VishaalFX — Student Enrollment & Consent Agreement",
    subject: `Agreement ${input.agreementId}`,
    creator: "VishaalFX Enrollment System",
    sections: [{ properties: {}, children }],
  });

  return Packer.toBuffer(doc);
}
