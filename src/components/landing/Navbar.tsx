import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-base-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            Vishaal<span className="text-accent">FX</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/legal/risk" className="hover:text-white transition-colors">Risk Disclosure</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">My Enrollment</Link>
        </nav>
        <Link href="/join">
          <Button size="sm">Join Now</Button>
        </Link>
      </div>
    </header>
  );
}
