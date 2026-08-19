"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StepShell, FieldError } from "./StepShell";
import { SignaturePad, SignaturePadHandle } from "./SignaturePad";

export function SignatureStep({ onComplete }: { onComplete: () => void }) {
  const [fullLegalName, setFullLegalName] = useState("");
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const padRef = useRef<SignaturePadHandle>(null);

  function useTypedSignature() {
    if (!fullLegalName.trim()) return;
    padRef.current?.drawText(fullLegalName.trim());
  }

  async function submit() {
    if (!padRef.current || padRef.current.isEmpty()) {
      setError("Please provide your signature before continuing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/registration/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullLegalName, signatureDataUrl: padRef.current.toDataUrl() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save signature.");
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
    <StepShell title="Sign Your Enrollment Agreement" subtitle="This captures an electronic signature for your enrollment record.">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-white/60">Full Legal Name *</span>
        <input
          value={fullLegalName}
          onChange={(e) => setFullLegalName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-base-800 px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
          placeholder="Full legal name"
        />
      </label>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs font-medium text-white/60">
          {mode === "draw" ? "Draw your signature" : "Typed signature preview"}
        </span>
        <button
          type="button"
          className="text-xs text-accent hover:underline"
          onClick={() => {
            setMode((m) => (m === "draw" ? "type" : "draw"));
            padRef.current?.clear();
          }}
        >
          {mode === "draw" ? "Type instead" : "Draw instead"}
        </button>
      </div>

      <div className="mt-2">
        <SignaturePad ref={padRef} onChangeEmpty={setEmpty} />
      </div>

      {mode === "type" && (
        <Button size="sm" variant="secondary" className="mt-3" onClick={useTypedSignature} disabled={!fullLegalName.trim()}>
          Use typed signature
        </Button>
      )}

      <div className="mt-3 flex gap-3">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            padRef.current?.clear();
            setEmpty(true);
          }}
        >
          Clear
        </Button>
      </div>

      <p className="mt-4 text-xs text-white/35">
        This is a system-captured electronic signature, not a government-issued Digital Signature Certificate (DSC).
      </p>

      <FieldError message={error} />
      <Button size="lg" className="mt-6 w-full" disabled={loading || empty || !fullLegalName.trim()} onClick={submit}>
        Confirm Signature
      </Button>
    </StepShell>
  );
}
