"use client";

import { useEffect, useState } from "react";
import { StepProgress } from "./StepProgress";
import { DetailsStep } from "./DetailsStep";
import { DocumentsStep } from "./DocumentsStep";
import { ConsentStep } from "./ConsentStep";
import { SignatureStep } from "./SignatureStep";
import { SubmissionStep } from "./SubmissionStep";
import type { LegalSection } from "@/content/legal";

type Doc = { version: string; sections: LegalSection[] };

interface RegistrationStatus {
  authenticated: boolean;
  detailsComplete?: boolean;
  documentsAccepted?: boolean;
  finalConsentGiven?: boolean;
  signatureComplete?: boolean;
}

function resolveStep(s: RegistrationStatus): number {
  if (!s.authenticated || !s.detailsComplete) return 1;
  if (!s.documentsAccepted) return 2;
  if (!s.finalConsentGiven) return 3;
  if (!s.signatureComplete) return 4;
  return 5;
}

export function JoinWizard({ terms, privacy, risk }: { terms: Doc; privacy: Doc; risk: Doc }) {
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/registration/status")
      .then((r) => r.json())
      .then((data: RegistrationStatus) => setStep(resolveStep(data)))
      .catch(() => setStep(1));
  }, []);

  if (step === null) {
    return <div className="py-24 text-center text-sm text-white/40">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <StepProgress current={step} />
      {step === 1 && <DetailsStep onComplete={() => setStep(2)} />}
      {step === 2 && <DocumentsStep terms={terms} privacy={privacy} risk={risk} onComplete={() => setStep(3)} />}
      {step === 3 && <ConsentStep onComplete={() => setStep(4)} />}
      {step === 4 && <SignatureStep onComplete={() => setStep(5)} />}
      {step === 5 && <SubmissionStep />}
    </div>
  );
}
