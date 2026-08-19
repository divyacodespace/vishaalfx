import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { termsAndConditions } from "@/content/legal";

export const metadata = { title: "Terms & Conditions — VishaalFX" };

export default function TermsPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold text-white">Terms &amp; Conditions</h1>
        <p className="mt-2 text-xs text-warn/80">
          Draft template — requires review by a qualified legal professional before production use.
        </p>
        <div className="mt-6">
          <LegalDocument title="Terms & Conditions" version={termsAndConditions.version} sections={termsAndConditions.sections} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
