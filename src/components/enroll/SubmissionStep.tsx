"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StepShell, FieldError } from "./StepShell";
import { CURRENT_TERMS_VERSION } from "@/lib/config";

interface Summary {
  fullName: string | null;
  email: string | null;
  mobile: string | null;
  countryCode: string | null;
  documentsAccepted: boolean;
  agreementId: string | null;
  agreementStatus: string | null;
}

export function SubmissionStep() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/registration/status")
      .then((r) => r.json())
      .then((data) => {
        setSummary(data);
        if (data.agreementStatus && data.agreementStatus !== "IN_PROGRESS") {
          setSubmitted(true);
        }
      });
  }, []);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/registration/submit", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not submit your agreement.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <StepShell title="Agreement Submitted Successfully ✓">
        <p className="text-sm text-white/70">
          Your enrollment agreement has been submitted for admin verification.
        </p>
        <p className="mt-2 text-sm text-white/70">You will be notified once an administrator has reviewed and approved your submission.</p>
        <Link href="/dashboard">
          <Button size="lg" className="mt-6 w-full">
            Go to My Enrollment
          </Button>
        </Link>
      </StepShell>
    );
  }

  return (
    <StepShell title="Agreement Summary" subtitle="Please review before submitting.">
      {summary ? (
        <dl className="space-y-2 text-sm">
          <Row label="Student Name" value={summary.fullName ?? "—"} />
          <Row label="Email" value={summary.email ?? "—"} />
          <Row label="Mobile" value={summary.mobile ? `${summary.countryCode ?? ""} ${summary.mobile}` : "—"} />
          <Row label="Age Eligibility" value="18+" />
          <Row label="Terms Version" value={CURRENT_TERMS_VERSION} />
          <Row label="Risk Disclosure" value="Accepted" />
          <Row label="Privacy Policy" value="Accepted" />
          <Row label="Date" value={new Date().toLocaleDateString("en-GB")} />
        </dl>
      ) : (
        <p className="text-sm text-white/50">Loading summary…</p>
      )}
      <FieldError message={error} />
      <Button size="lg" className="mt-6 w-full" disabled={loading || !summary} onClick={submit}>
        Submit & Sign Agreement
      </Button>
    </StepShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-2">
      <dt className="text-white/45">{label}</dt>
      <dd className="font-medium text-white">{value}</dd>
    </div>
  );
}
