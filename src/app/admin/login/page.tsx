"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-grid-fade px-6">
      <Card className="w-full max-w-sm p-8">
        <h1 className="text-lg font-bold text-white">
          Vishaal<span className="text-accent">FX</span> Admin
        </h1>
        <p className="mt-1 text-sm text-white/50">Sign in to review enrollments.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            className="w-full rounded-lg border border-white/10 bg-base-800 px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-white/10 bg-base-800 px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
          />
          {error && <p className="text-sm text-loss">{error}</p>}
          <Button size="lg" className="w-full" disabled={loading} type="submit">
            Sign In
          </Button>
        </form>
      </Card>
    </main>
  );
}
