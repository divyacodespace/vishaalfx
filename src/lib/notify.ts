import { business } from "./config";

// Best-effort admin notification. No email credentials are configured by
// default — this safely no-ops (logging to the server console) until a
// real transactional email provider is wired up using env vars. It must
// NEVER send the signed PDF as an attachment; it only links into the
// authenticated admin dashboard.
export async function notifyAdminOfNewEnrollment(params: { agreementId: string; studentName: string }) {
  const to = business.adminNotificationEmail;
  console.log(
    `[notify] New enrollment ${params.agreementId} from ${params.studentName} pending review. ` +
      `Would notify admin at ${to} (email delivery not configured — review in admin dashboard).`
  );
}

export function maskMobile(mobile: string | null): string {
  if (!mobile) return "—";
  if (mobile.length <= 4) return "*".repeat(mobile.length);
  return `${"*".repeat(mobile.length - 4)}${mobile.slice(-4)}`;
}
