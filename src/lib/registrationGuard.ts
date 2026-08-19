import { cookies } from "next/headers";
import { prisma } from "./db";
import { ApiError } from "./apiError";
import { STUDENT_SESSION_COOKIE, verifyStudentToken, signStudentToken, studentCookieOptions } from "./session";

/**
 * Server-side step gating. Every registration API route must call the
 * relevant guard below rather than trusting the client's idea of what step
 * it's on — the frontend wizard is a UX convenience only.
 */

export async function getSessionUserOrThrow() {
  const token = (await cookies()).get(STUDENT_SESSION_COOKIE)?.value;
  const payload = token ? verifyStudentToken(token) : null;
  if (!payload) {
    throw new ApiError(401, "Session expired or not found. Please start again.", "NO_SESSION");
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { consent: true, signature: true, agreement: true },
  });
  if (!user) {
    throw new ApiError(401, "Session invalid. Please start again.", "NO_SESSION");
  }
  return user;
}

/**
 * Used only by the first registration step (POST /api/registration/details).
 * Every later step relies on getSessionUserOrThrow because by then a session
 * must already exist — this is the one place that's allowed to create one.
 */
export async function getOrCreateSessionUser() {
  const existingToken = (await cookies()).get(STUDENT_SESSION_COOKIE)?.value;
  const payload = existingToken ? verifyStudentToken(existingToken) : null;
  if (payload) {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { consent: true, signature: true, agreement: true },
    });
    if (user) return user;
  }

  const user = await prisma.user.create({ data: {} });
  const token = signStudentToken(user.id);
  (await cookies()).set(STUDENT_SESSION_COOKIE, token, studentCookieOptions());
  return { ...user, consent: null, signature: null, agreement: null };
}

export async function requireDetailsComplete() {
  const user = await getSessionUserOrThrow();
  if (!user.fullName || !user.email || !user.dateOfBirth) {
    throw new ApiError(403, "Student details are required before continuing.", "DETAILS_INCOMPLETE");
  }
  return user;
}

export async function requireDocumentsAccepted() {
  const user = await requireDetailsComplete();
  const consent = user.consent;
  if (!consent || !consent.termsAccepted || !consent.privacyAccepted || !consent.riskAccepted) {
    throw new ApiError(403, "You must read and accept all documents before continuing.", "DOCUMENTS_NOT_ACCEPTED");
  }
  return user;
}

export async function requireFinalConsent() {
  const user = await requireDocumentsAccepted();
  if (!user.consent?.finalConsentAt) {
    throw new ApiError(403, "Final consent confirmation is required before continuing.", "CONSENT_INCOMPLETE");
  }
  return user;
}

export async function requireSignature() {
  const user = await requireFinalConsent();
  if (!user.signature) {
    throw new ApiError(403, "Signature is required before continuing.", "SIGNATURE_MISSING");
  }
  return user;
}
