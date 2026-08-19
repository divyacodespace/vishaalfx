import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { riskDisclosure } from "@/content/legal";

export const metadata = { title: "Trading Risk Disclosure — VishaalFX" };

export default function RiskPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold text-white">Trading Risk Disclosure</h1>
        <p className="mt-2 text-xs text-warn/80">
          Draft template — requires review by a qualified legal professional before production use.
        </p>
        <div className="mt-4 rounded-lg border border-loss/30 bg-loss/5 p-4 text-sm font-medium text-loss">
          Trading and financial markets involve significant risk of loss.
        </div>
        <div className="mt-6">
          <LegalDocument title="Trading Risk Disclosure" version={riskDisclosure.version} sections={riskDisclosure.sections} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
