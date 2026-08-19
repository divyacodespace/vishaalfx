"use client";

import { LegalDocument } from "./LegalDocument";
import { Button } from "@/components/ui/Button";
import type { LegalSection } from "@/content/legal";

export function LegalDocumentModal({
  title,
  version,
  sections,
  onReachedEnd,
  onClose,
}: {
  title: string;
  version: string;
  sections: LegalSection[];
  onReachedEnd?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-base-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <LegalDocument title={title} version={version} sections={sections} onReachedEnd={onReachedEnd} />
        <Button variant="secondary" size="sm" className="mt-4 w-full shrink-0" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
