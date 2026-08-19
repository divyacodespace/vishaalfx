// Central place for env-driven configuration and business placeholders.
// Nothing here should ever contain invented legal/business information —
// values come from environment variables with obvious placeholder fallbacks.

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const appConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "VishaalFX",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",
};

export const business = {
  legalName: process.env.BUSINESS_LEGAL_NAME ?? "[LEGAL ENTITY NAME NOT YET PROVIDED]",
  address: process.env.BUSINESS_ADDRESS ?? "[REGISTERED ADDRESS NOT YET PROVIDED]",
  supportEmail: process.env.BUSINESS_SUPPORT_EMAIL ?? "support@example.com",
  supportPhone: process.env.BUSINESS_SUPPORT_PHONE ?? "[PHONE NUMBER NOT YET PROVIDED]",
  jurisdiction: process.env.BUSINESS_JURISDICTION ?? "[GOVERNING JURISDICTION NOT YET PROVIDED]",
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL ?? "admin@example.com",
};

export const storageConfig = {
  driver: process.env.STORAGE_DRIVER ?? "local",
  localRoot: process.env.LOCAL_STORAGE_ROOT ?? "./private-storage",
  s3: {
    bucket: process.env.S3_BUCKET ?? "",
    region: process.env.S3_REGION ?? "auto",
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    // Optional: only needed for S3-compatible providers other than AWS
    // (Cloudflare R2, Backblaze B2, MinIO, Supabase Storage, ...).
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  },
};

export function getStudentSessionSecret(): string {
  return required("STUDENT_SESSION_SECRET", appConfig.isProduction ? undefined : "dev-only-insecure-student-secret");
}

export function getAdminSessionSecret(): string {
  return required("ADMIN_SESSION_SECRET", appConfig.isProduction ? undefined : "dev-only-insecure-admin-secret");
}

export const CURRENT_TERMS_VERSION = "2.0";
export const CURRENT_PRIVACY_VERSION = "1.2";
export const CURRENT_RISK_VERSION = "1.0";
export const CURRENT_AGREEMENT_VERSION = "1.0";
