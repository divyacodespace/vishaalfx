"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Detail {
  agreementId: string;
  status: string;
  submittedAt: string | null;
  student: {
    fullName: string | null;
    email: string | null;
    mobile: string;
    city: string | null;
    institution: string | null;
    occupation: string | null;
    dateOfBirth: string | null;
  };
  signature: { fullLegalName: string; signedAt: string } | null;
}

export function EnrollmentDetailModal({
  agreementId,
  onClose,
  onChanged,
}: {
  agreementId: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/enrollments/${agreementId}`)
      .then((r) => r.json())
      .then(setDetail);
  }, [agreementId]);

  async function approve() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/enrollments/${agreementId}/approve`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not approve.");
        return;
      }
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function reject() {
    if (!reason.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/enrollments/${agreementId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not reject.");
        return;
      }
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-base-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {!detail ? (
          <p className="text-sm text-white/50">Loading…</p>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">{detail.student.fullName ?? "—"}</h2>
                <p className="font-mono text-xs text-white/40">{detail.agreementId}</p>
              </div>
              <Badge tone={detail.status === "APPROVED" ? "gain" : detail.status === "REJECTED" ? "loss" : "warn"}>
                {detail.status.replace("_", " ")}
              </Badge>
            </div>

            <dl className="space-y-1.5 text-sm">
              <Row k="Email" v={detail.student.email ?? "—"} />
              <Row k="Mobile" v={detail.student.mobile} />
              <Row k="Date of Birth" v={detail.student.dateOfBirth ? new Date(detail.student.dateOfBirth).toLocaleDateString("en-GB") : "—"} />
              <Row k="City" v={detail.student.city ?? "—"} />
              <Row k="Institution" v={detail.student.institution ?? "—"} />
              <Row k="Signed By" v={detail.signature?.fullLegalName ?? "—"} />
              <Row k="Signed At" v={detail.signature ? new Date(detail.signature.signedAt).toLocaleString() : "—"} />
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`/api/admin/enrollments/${agreementId}/pdf`} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary">Download Signed Agreement (PDF)</Button>
              </a>
              <a href={`/api/admin/enrollments/${agreementId}/docx`} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary">Download Agreement (.docx)</Button>
              </a>
              <a href={`/api/admin/enrollments/${agreementId}/signature`} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary">View Signature</Button>
              </a>
            </div>

            {error && <p className="mt-3 text-sm text-loss">{error}</p>}

            {detail.status === "PENDING_REVIEW" && (
              <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                {!rejecting ? (
                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={busy} onClick={approve}>Approve Enrollment</Button>
                    <Button variant="danger" className="flex-1" disabled={busy} onClick={() => setRejecting(true)}>
                      Reject
                    </Button>
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason for rejection"
                      className="w-full rounded-lg border border-white/10 bg-base-800 px-3 py-2 text-sm text-white outline-none focus:border-accent"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button variant="danger" className="flex-1" disabled={busy || !reason.trim()} onClick={reject}>
                        Confirm Rejection
                      </Button>
                      <Button variant="ghost" onClick={() => setRejecting(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={onClose}>Close</Button>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-1.5">
      <dt className="text-white/45">{k}</dt>
      <dd className="text-white">{v}</dd>
    </div>
  );
}
