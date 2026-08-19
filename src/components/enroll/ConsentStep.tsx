"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { StepShell, FieldError } from "./StepShell";

const ITEMS = [
  { key: "confirmAge", label: "I confirm that I am 18 years of age or older." },
  { key: "confirmTerms", label: "I have read and agree to the VishaalFX Terms & Conditions." },
  { key: "confirmPrivacy", label: "I have read and understood the Privacy Policy." },
  { key: "confirmRisk", label: "I have read and understood the Trading Risk Disclosure." },
  {
    key: "confirmNoGuarantee",
    label: "I understand that trading involves financial risk and that VishaalFX does not guarantee profits or returns.",
  },
] as const;

type Key = (typeof ITEMS)[number]["key"];

export function ConsentStep({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<Record<Key, boolean>>({
    confirmAge: false,
    confirmTerms: false,
    confirmPrivacy: false,
    confirmRisk: false,
    confirmNoGuarantee: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allChecked = ITEMS.every((i) => state[i.key]);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/registration/consent/final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Please confirm all statements to continue.");
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
    <StepShell title="Before continuing, please confirm:">
      <div className="space-y-4">
        {ITEMS.map((item) => (
          <Checkbox
            key={item.key}
            id={item.key}
            label={item.label}
            checked={state[item.key]}
            onChange={(e) => setState((s) => ({ ...s, [item.key]: e.target.checked }))}
          />
        ))}
      </div>
      <FieldError message={error} />
      <Button size="lg" className="mt-6 w-full" disabled={loading || !allChecked} onClick={submit}>
        Continue to Digital Signature
      </Button>
    </StepShell>
  );
}
