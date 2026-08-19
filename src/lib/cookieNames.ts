// Cookie name constants only — kept dependency-free (no jsonwebtoken import)
// so this module is safe to use from Edge runtime code like middleware.ts.
export const STUDENT_SESSION_COOKIE = "vfx_student_session";
export const ADMIN_SESSION_COOKIE = "vfx_admin_session";
