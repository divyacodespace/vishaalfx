import Link from "next/link";
import { business } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12 text-sm text-white/40">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <p className="font-bold text-white/70">
              Vishaal<span className="text-accent">FX</span>
            </p>
            <p className="mt-2 max-w-sm text-xs leading-relaxed">
              A verification and digital consent platform. Not investment advice. Trading involves risk of
              loss. No profits, returns, or income are guaranteed.
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Legal</p>
              <ul className="space-y-1.5">
                <li><Link href="/legal/terms" className="hover:text-white/70">Terms &amp; Conditions</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white/70">Privacy Policy</Link></li>
                <li><Link href="/legal/risk" className="hover:text-white/70">Risk Disclosure</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Contact</p>
              <ul className="space-y-1.5">
                <li>{business.supportEmail}</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-white/5 pt-6 text-xs text-white/25">
          © {new Date().getFullYear()} {business.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
