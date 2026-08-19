"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StepShell, FieldError } from "./StepShell";
import { LegalDocumentModal } from "@/components/legal/LegalDocumentModal";
import type { LegalSection } from "@/content/legal";

type Doc = { version: string; sections: LegalSection[] };
type TabKey = "terms" | "privacy" | "risk";

function DocRow({
  label,
  read,
  checked,
  onOpen,
  onToggle,
}: {
  label: string;
  read: boolean;
  checked: boolean;
  onOpen: () => void;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-base-800/40 p-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          disabled={!read}
          onChange={(e) => onToggle(e.target.checked)}
          className="vfx-checkbox mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-white/30 bg-base-800 disabled:opacity-40"
        />
        <p className="text-sm leading-relaxed text-white/80">
          I have read and understood the{" "}
          <button
            type="button"
            onClick={onOpen}
            className="font-medium text-accent underline underline-offset-2 hover:text-accent-soft"
          >
            {label}
          </button>
          .
        </p>
      </div>
      {!read && <p className="mt-2 pl-7 text-xs text-white/35">Click &ldquo;{label}&rdquo; above to open and read it.</p>}
    </div>
  );
}

export function DocumentsStep({
  terms,
  privacy,
  risk,
  onComplete,
}: {
  terms: Doc;
  privacy: Doc;
  risk: Doc;
  onComplete: () => void;
}) {
  const [openDoc, setOpenDoc] = useState<TabKey | null>(null);
  const [read, setRead] = useState<Record<TabKey, boolean>>({ terms: false, privacy: false, risk: false });
  const [checked, setChecked] = useState<Record<TabKey, boolean>>({ terms: false, privacy: false, risk: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const docs: Record<TabKey, { label: string; doc: Doc }> = {
    terms: { label: "Terms & Conditions", doc: terms },
    privacy: { label: "Privacy Policy", doc: privacy },
    risk: { label: "Trading Risk Disclosure", doc: risk },
  };

  const allChecked = checked.terms && checked.privacy && checked.risk;

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/registration/consent/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsAccepted: true, privacyAccepted: true, riskAccepted: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Please accept all documents to continue.");
        return;
      }
      onComplete();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StepShell title="Review Required Documents" subtitle="Click each document below to open and read it in full — nothing is shown until you click.">
      <div className="space-y-3">
        {(Object.keys(docs) as TabKey[]).map((key) => (
          <DocRow
            key={key}
            label={docs[key].label}
            read={read[key]}
            checked={checked[key]}
            onOpen={() => setOpenDoc(key)}
            onToggle={(v) => setChecked((c) => ({ ...c, [key]: v }))}
          />
        ))}
      </div>

      {openDoc && (
        <LegalDocumentModal
          title={docs[openDoc].label}
          version={docs[openDoc].doc.version}
          sections={docs[openDoc].doc.sections}
          onReachedEnd={() => setRead((r) => ({ ...r, [openDoc]: true }))}
          onClose={() => setOpenDoc(null)}
        />
      )}

      <FieldError message={error} />
      <Button size="lg" className="mt-6 w-full" disabled={loading || !allChecked} onClick={submit}>
        Continue
      </Button>
    </StepShell>
  );
}
