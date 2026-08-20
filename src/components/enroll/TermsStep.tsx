"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StepShell, FieldError } from "./StepShell";
import { LegalDocumentModal } from "@/components/legal/LegalDocumentModal";
import type { LegalSection } from "@/content/legal";

type Doc = { version: string; sections: LegalSection[] };
type TabKey = "terms" | "privacy" | "risk";

export function TermsStep({
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
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const docs: Record<TabKey, { label: string; doc: Doc }> = {
    terms: { label: "Terms & Conditions", doc: terms },
    privacy: { label: "Privacy Policy", doc: privacy },
    risk: { label: "Trading Risk Disclosure", doc: risk },
  };

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const documentsRes = await fetch("/api/registration/consent/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsAccepted: true, privacyAccepted: true, riskAccepted: true }),
      });
      const documentsData = await documentsRes.json();
      if (!documentsRes.ok) {
        setError(documentsData.error ?? "Please agree to continue.");
        return;
      }

      const finalRes = await fetch("/api/registration/consent/final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmAge: true,
          confirmTerms: true,
          confirmPrivacy: true,
          confirmRisk: true,
          confirmNoGuarantee: true,
        }),
      });
      const finalData = await finalRes.json();
      if (!finalRes.ok) {
        setError(finalData.error ?? "Please agree to continue.");
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
    <StepShell title="Terms & Consent" subtitle="Please review the documents below before agreeing.">
      <div className="space-y-2 text-sm text-white/70">
        {(Object.keys(docs) as TabKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setOpenDoc(key)}
            className="block font-medium text-accent underline underline-offset-2 hover:text-accent-soft"
          >
            {docs[key].label}
          </button>
        ))}
      </div>

      {openDoc && (
        <LegalDocumentModal
          title={docs[openDoc].label}
          version={docs[openDoc].doc.version}
          sections={docs[openDoc].doc.sections}
          onClose={() => setOpenDoc(null)}
        />
      )}

      <div className="mt-6 rounded-lg border border-white/10 bg-base-800/40 p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="vfx-checkbox mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-white/30 bg-base-800"
          />
          <span className="text-sm leading-relaxed text-white/80">
            I confirm I am 18 years of age or older, and I have read and agree to the Terms & Conditions,
            Privacy Policy, and Trading Risk Disclosure. I understand that trading involves financial risk
            and that VishaalFX does not guarantee profits or returns.
          </span>
        </label>
      </div>

      <FieldError message={error} />
      <Button size="lg" className="mt-6 w-full" disabled={loading || !agreed} onClick={submit}>
        Continue to Digital Signature
      </Button>
    </StepShell>
  );
}
