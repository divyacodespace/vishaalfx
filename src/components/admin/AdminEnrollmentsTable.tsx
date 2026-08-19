"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EnrollmentDetailModal } from "./EnrollmentDetailModal";

interface EnrollmentRow {
  userId: string;
  agreementId: string;
  studentName: string | null;
  mobile: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  riskAccepted: boolean;
  signatureCompleted: boolean;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  submittedDate: string | null;
}

function StatusBadge({ status }: { status: EnrollmentRow["status"] }) {
  if (status === "APPROVED") return <Badge tone="gain">Approved</Badge>;
  if (status === "REJECTED") return <Badge tone="loss">Rejected</Badge>;
  return <Badge tone="warn">Pending Review</Badge>;
}

function YesNo({ v }: { v: boolean }) {
  return <span className={v ? "text-gain" : "text-white/30"}>{v ? "✓" : "—"}</span>;
}

export function AdminEnrollmentsTable() {
  const [rows, setRows] = useState<EnrollmentRow[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/enrollments");
    if (res.ok) {
      const data = await res.json();
      setRows(data.enrollments);
    }
  }

  useEffect(() => {
    let ignore = false;
    (async () => {
      const res = await fetch("/api/admin/enrollments");
      if (res.ok && !ignore) {
        const data = await res.json();
        setRows(data.enrollments);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  if (!rows) return <p className="text-sm text-white/40">Loading enrollments…</p>;
  if (rows.length === 0) return <p className="text-sm text-white/40">No enrollment submissions yet.</p>;

  return (
    <>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Terms</th>
              <th className="px-4 py-3">Privacy</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Signature</th>
              <th className="px-4 py-3">Agreement ID</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.userId} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-white">{r.studentName ?? "—"}</td>
                <td className="px-4 py-3 text-white/60">{r.mobile}</td>
                <td className="px-4 py-3"><YesNo v={r.termsAccepted} /></td>
                <td className="px-4 py-3"><YesNo v={r.privacyAccepted} /></td>
                <td className="px-4 py-3"><YesNo v={r.riskAccepted} /></td>
                <td className="px-4 py-3"><YesNo v={r.signatureCompleted} /></td>
                <td className="px-4 py-3 font-mono text-xs text-white/50">{r.agreementId}</td>
                <td className="px-4 py-3 text-white/50">
                  {r.submittedDate ? new Date(r.submittedDate).toLocaleDateString("en-GB") : "—"}
                </td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="secondary" onClick={() => setSelected(r.agreementId)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {selected && (
        <EnrollmentDetailModal
          agreementId={selected}
          onClose={() => setSelected(null)}
          onChanged={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </>
  );
}
