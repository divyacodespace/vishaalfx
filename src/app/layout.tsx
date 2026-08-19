import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VishaalFX — Verification & Digital Consent",
  description:
    "A secure age verification, mobile verification, and digital consent agreement process for individuals aged 18 and above. VishaalFX does not guarantee profits or returns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
