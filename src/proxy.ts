import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, STUDENT_SESSION_COOKIE } from "@/lib/cookieNames";

// Fast, edge-safe redirect based on cookie presence only — this is a UX
// convenience, NOT the source of authorization truth. Every server
// component and API route independently re-verifies the session token
// (see src/lib/session.ts and src/lib/adminAuth.ts) since JWT verification
// requires the Node.js runtime, which proxy does not guarantee.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/dashboard")) {
    const hasAdminCookie = req.cookies.has(ADMIN_SESSION_COOKIE);
    if (!hasAdminCookie) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    const hasStudentCookie = req.cookies.has(STUDENT_SESSION_COOKIE);
    if (!hasStudentCookie) {
      return NextResponse.redirect(new URL("/join", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/dashboard/:path*"],
};
