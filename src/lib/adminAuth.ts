import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getAdminSessionSecret } from "./config";
import { ADMIN_SESSION_COOKIE } from "./cookieNames";

export { ADMIN_SESSION_COOKIE };
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: string;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, getAdminSessionSecret(), { expiresIn: ADMIN_SESSION_TTL_SECONDS });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, getAdminSessionSecret()) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  };
}

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
