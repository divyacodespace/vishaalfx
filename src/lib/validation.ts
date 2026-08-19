import { z } from "zod";

export const studentDetailsSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  dateOfBirth: z.string().refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date of birth"),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  institution: z.string().trim().max(160).optional().or(z.literal("")),
  occupation: z.string().trim().max(160).optional().or(z.literal("")),
  countryCode: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}$/, "Enter a valid country code, e.g. +91")
    .optional()
    .or(z.literal("")),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{6,14}$/, "Enter a valid mobile number")
    .optional()
    .or(z.literal("")),
});

export const consentDocumentsSchema = z.object({
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the Terms & Conditions" }) }),
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the Privacy Policy" }) }),
  riskAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the Risk Disclosure" }) }),
});

export const finalConsentSchema = z.object({
  confirmAge: z.literal(true),
  confirmTerms: z.literal(true),
  confirmPrivacy: z.literal(true),
  confirmRisk: z.literal(true),
  confirmNoGuarantee: z.literal(true),
});

export const signatureSchema = z.object({
  fullLegalName: z.string().trim().min(2, "Full legal name is required").max(120),
  signatureDataUrl: z
    .string()
    .startsWith("data:image/png;base64,", "Signature must be a PNG data URL")
    .max(2_000_000, "Signature image too large"),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const rejectEnrollmentSchema = z.object({
  reason: z.string().trim().min(3).max(500),
});
