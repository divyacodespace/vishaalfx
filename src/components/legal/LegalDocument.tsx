"use client";

import { useRef, useState } from "react";
import type { LegalSection } from "@/content/legal";

export function LegalDocument({
  title,
  version,
  sections,
  onReachedEnd,
  compact = false,
}: {
  title: string;
  version: string;
  sections: LegalSection[];
  onReachedEnd?: () => void;
  compact?: boolean;
}) {
  const [reachedEnd, setReachedEnd] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const el = ref.current;
    if (!el || reachedEnd) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
      setReachedEnd(true);
      onReachedEnd?.();
    }
  }

  return (
    <div>
      {!compact && (
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <span className="text-xs text-white/40">Version {version}</span>
        </div>
      )}
      <div
        ref={ref}
        onScroll={handleScroll}
        className={`overflow-y-auto rounded-lg border border-white/10 bg-base-800/50 p-5 text-sm leading-relaxed text-white/70 ${
          compact ? "h-64" : "h-[55vh]"
        }`}
      >
        {sections.map((s) => (
          <div key={s.heading} className="mb-5 last:mb-0">
            <h3 className="mb-1.5 font-semibold text-white/90">{s.heading}</h3>
            {s.body.map((p, i) => (
              <p key={i} className="mb-1.5 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        ))}
        <p className="pt-2 text-center text-xs text-white/25">— End of document —</p>
      </div>
      {!reachedEnd && onReachedEnd && (
        <p className="mt-2 text-xs text-warn/80">Please scroll to the end of the document to continue.</p>
      )}
    </div>
  );
}
