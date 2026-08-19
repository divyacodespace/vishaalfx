import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { compareSecret } from "@/lib/crypto";
import { adminCookieOptions, ADMIN_SESSION_COOKIE, signAdminToken } from "@/lib/adminAuth";
import { adminLoginSchema } from "@/lib/validation";
import { errorResponse } from "@/lib/apiError";
import { logAudit, getClientIp } from "@/lib/audit";

// Simple in-memory login attempt throttling per IP (best-effort; use a
// shared store like Redis in a multi-instance production deployment).
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(await headers()) ?? "unknown";
    const now = Date.now();
    const bucket = attempts.get(ip);
    if (bucket && bucket.resetAt > now && bucket.count >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    const valid = admin ? await compareSecret(parsed.data.password, admin.passwordHash) : false;

    if (!admin || !valid) {
      attempts.set(ip, { count: (bucket?.count ?? 0) + 1, resetAt: bucket?.resetAt ?? now + WINDOW_MS });
      await logAudit({ actorType: "admin", action: "admin_login_failed", metadata: { email: parsed.data.email }, ipAddress: ip });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    attempts.delete(ip);
    await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    await logAudit({ actorType: "admin", actorId: admin.id, action: "admin_login_success", ipAddress: ip });

    const token = signAdminToken({ adminId: admin.id, email: admin.email, role: admin.role });
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, token, adminCookieOptions());
    return res;
  } catch (err) {
    return errorResponse(err);
  }
}
