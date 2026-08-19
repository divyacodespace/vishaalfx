import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getStudentSessionSecret } from "./config";
import { STUDENT_SESSION_COOKIE } from "./cookieNames";

export { STUDENT_SESSION_COOKIE };
const STUDENT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

interface StudentTokenPayload {
  userId: string;
}

export function signStudentToken(userId: string): string {
  return jwt.sign({ userId } satisfies StudentTokenPayload, getStudentSessionSecret(), {
    expiresIn: STUDENT_SESSION_TTL_SECONDS,
  });
}

export function verifyStudentToken(token: string): StudentTokenPayload | null {
  try {
    return jwt.verify(token, getStudentSessionSecret()) as StudentTokenPayload;
  } catch {
    return null;
  }
}

export function studentCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: STUDENT_SESSION_TTL_SECONDS,
  };
}

/** Reads the current student session from cookies in a Server Component / Route Handler. */
export async function getStudentUserId(): Promise<string | null> {
  const token = (await cookies()).get(STUDENT_SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyStudentToken(token);
  return payload?.userId ?? null;
}
