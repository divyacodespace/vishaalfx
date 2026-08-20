"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StepShell, FieldError } from "./StepShell";

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/60">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-white/10 bg-base-800 px-3 py-2.5 text-sm text-white outline-none focus:border-accent disabled:opacity-50"
      />
    </label>
  );
}

export function DetailsStep({ onComplete }: { onComplete: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [city, setCity] = useState("");
  const [institution, setInstitution] = useState("");
  const [occupation, setOccupation] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/registration/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          dateOfBirth,
          city,
          institution,
          occupation,
          countryCode,
          mobile,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Please check the details you entered.");
        return;
      }
      onComplete();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    fullName.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(email) &&
    dateOfBirth &&
    /^\+\d{1,4}$/.test(countryCode) &&
    /^\d{6,14}$/.test(mobile);

  return (
    <StepShell title="Student Details" subtitle="Only the information required to process your enrollment.">
      <div className="space-y-4">
        <Field label="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
        <Field label="Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Field label="Date of Birth *" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Optional" />
          <Field label="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Optional" />
        </div>
        <Field label="Student / Occupation Status" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Optional" />
        <div>
          <span className="mb-1.5 block text-xs font-medium text-white/60">Mobile Number *</span>
          <div className="flex gap-3">
            <input
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-20 rounded-lg border border-white/10 bg-base-800 px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              placeholder="+91"
            />
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="flex-1 rounded-lg border border-white/10 bg-base-800 px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              placeholder="Mobile number"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>
      <FieldError message={error} />
      <Button size="lg" className="mt-6 w-full" disabled={loading || !canSubmit} onClick={submit}>
        Continue
      </Button>
    </StepShell>
  );
}
