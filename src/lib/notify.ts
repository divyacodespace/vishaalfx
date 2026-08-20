import { Resend } from "resend";
import { appConfig, business, emailConfig } from "./config";

// Emails the signed agreement PDF to the student and to the admin
// notification mailbox. Requires RESEND_API_KEY to be configured — without
// it, this safely no-ops (logging to the server console) so registration
// still succeeds even if email delivery isn't set up yet.
export async function sendAgreementEmails(params: {
  agreementId: string;
  studentName: string;
  studentEmail: string | null;
  pdfBuffer: Buffer;
}) {
  const { agreementId, studentName, studentEmail, pdfBuffer } = params;

  if (!emailConfig.resendApiKey) {
    console.log(
      `[notify] Email delivery not configured (RESEND_API_KEY missing) — agreement ${agreementId} for ` +
        `${studentName} was generated but not emailed. Review it in the admin dashboard.`
    );
    return;
  }

  const resend = new Resend(emailConfig.resendApiKey);
  const attachment = {
    filename: `VishaalFX-Agreement-${agreementId}.pdf`,
    content: pdfBuffer.toString("base64"),
  };

  const sends: Promise<unknown>[] = [];

  if (studentEmail) {
    sends.push(
      resend.emails.send({
        from: emailConfig.fromEmail,
        to: studentEmail,
        subject: "Your VishaalFX Enrollment Agreement",
        text:
          `Hi ${studentName},\n\n` +
          `Thank you for completing your VishaalFX enrollment. Your signed agreement is attached for your records.\n\n` +
          `Your submission is now pending admin review — you'll be notified once it's approved. You can check your ` +
          `status anytime at ${appConfig.appUrl}/dashboard.\n\n— VishaalFX`,
        attachments: [attachment],
      })
    );
  }

  sends.push(
    resend.emails.send({
      from: emailConfig.fromEmail,
      to: business.adminNotificationEmail,
      subject: `New Enrollment — ${studentName}`,
      text:
        `A new enrollment agreement was submitted by ${studentName} and is pending review.\n\n` +
        `Agreement ID: ${agreementId}\n\n` +
        `Review it in the admin dashboard: ${appConfig.appUrl}/admin/dashboard`,
      attachments: [attachment],
    })
  );

  const results = await Promise.allSettled(sends);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[notify] Failed to send agreement email:", result.reason);
    }
  }
}

export function maskMobile(mobile: string | null): string {
  if (!mobile) return "—";
  if (mobile.length <= 4) return "*".repeat(mobile.length);
  return `${"*".repeat(mobile.length - 4)}${mobile.slice(-4)}`;
}
