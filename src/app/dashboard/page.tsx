import { redirect } from "next/navigation";
import { getStudentUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/landing/Navbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await getStudentUserId();
  if (!userId) redirect("/join");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { agreement: true },
  });
  if (!user) redirect("/join");

  if (!user.agreement || user.agreement.status === "IN_PROGRESS") {
    redirect("/join");
  }

  const status = user.agreement.status;

  return (
    <main className="min-h-screen bg-grid-fade">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-16">
        {status === "PENDING_REVIEW" && (
          <Card className="p-8 text-center">
            <Badge tone="warn">🟡 Pending Admin Verification</Badge>
            <h1 className="mt-4 text-xl font-bold text-white">Agreement Status</h1>
            <p className="mt-3 text-sm text-white/60">
              Your details and signed agreement have been submitted successfully and are awaiting
              administrator review. You will be notified once your submission has been verified.
            </p>
            <p className="mt-4 font-mono text-xs text-white/30">Agreement ID: {user.agreement.id}</p>
          </Card>
        )}

        {status === "REJECTED" && (
          <Card className="p-8 text-center">
            <Badge tone="loss">Not Approved</Badge>
            <h1 className="mt-4 text-xl font-bold text-white">Agreement Status</h1>
            <p className="mt-3 text-sm text-white/60">
              {user.agreement.rejectionReason
                ? `Your submission was not approved: ${user.agreement.rejectionReason}`
                : "Your submission was not approved. Please contact support for more information."}
            </p>
          </Card>
        )}

        {status === "APPROVED" && (
          <Card className="p-8 text-center">
            <Badge tone="gain">✓ Verified & Approved</Badge>
            <h1 className="mt-4 text-xl font-bold text-white">
              Thank you{user.fullName ? `, ${user.fullName}` : ""}.
            </h1>
            <p className="mt-3 text-sm text-white/60">
              Your identity verification and signed consent agreement have been reviewed and approved by a
              VishaalFX administrator. Your signed record is securely retained for administrative purposes.
            </p>
            <p className="mt-4 font-mono text-xs text-white/30">Agreement ID: {user.agreement.id}</p>
            {user.agreement.approvedAt && (
              <p className="mt-1 text-xs text-white/30">
                Approved {new Date(user.agreement.approvedAt).toLocaleDateString("en-GB")}
              </p>
            )}
          </Card>
        )}

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost" size="sm">Back to Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
