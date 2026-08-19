import { Navbar } from "@/components/landing/Navbar";
import { JoinWizard } from "@/components/enroll/JoinWizard";
import { termsAndConditions, privacyPolicy, riskDisclosure } from "@/content/legal";

export const metadata = { title: "Register — VishaalFX" };

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-grid-fade">
      <Navbar />
      <JoinWizard terms={termsAndConditions} privacy={privacyPolicy} risk={riskDisclosure} />
    </main>
  );
}
