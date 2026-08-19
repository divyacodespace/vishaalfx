import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-fade px-6 pb-24 pt-20 md:pt-28">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
          <Badge tone="warn">18+ ONLY</Badge>
          <Badge tone="accent">VERIFIED DIGITAL CONSENT</Badge>
        </div>

        <h1 className="animate-fade-up text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl" style={{ animationDelay: "80ms" }}>
          Verify Your Eligibility.
          <br />
          Sign Your Agreement.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-balance text-lg text-white/60" style={{ animationDelay: "160ms" }}>
          A secure registration process for individuals aged 18 and above — age verification, mobile
          verification, and a digitally signed consent agreement, reviewed by a VishaalFX administrator.
        </p>

        <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "240ms" }}>
          <Link href="/join">
            <Button size="lg">Start Registration</Button>
          </Link>
        </div>

        <p className="mx-auto mt-8 max-w-xl animate-fade-up text-xs text-white/40" style={{ animationDelay: "320ms" }}>
          VishaalFX does not guarantee profits, returns, or income. Trading involves risk of loss.
        </p>
      </div>
    </section>
  );
}
