import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { privacyPolicy } from "@/content/legal";

export const metadata = { title: "Privacy Policy — VishaalFX" };

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-xs text-warn/80">
          Draft template — does not claim compliance with any specific data protection law until reviewed and implemented accordingly.
        </p>
        <div className="mt-6">
          <LegalDocument title="Privacy Policy" version={privacyPolicy.version} sections={privacyPolicy.sections} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
