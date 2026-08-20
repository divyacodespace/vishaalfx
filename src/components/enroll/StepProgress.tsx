"use client";

const STEPS = ["Details", "Terms", "Signature", "Submission"];

export function StepProgress({ current }: { current: number }) {
  return (
    <div className="mx-auto mb-10 flex max-w-2xl items-center justify-between overflow-x-auto px-1">
      {STEPS.map((label, idx) => {
        const stepNum = idx + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isDone
                    ? "bg-accent text-base-950"
                    : isActive
                    ? "border-2 border-accent text-accent"
                    : "border border-white/15 text-white/35"
                }`}
              >
                {isDone ? "✓" : stepNum}
              </div>
              <span className={`whitespace-nowrap text-[11px] ${isActive ? "text-white" : "text-white/35"}`}>{label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`mx-2 h-px flex-1 ${isDone ? "bg-accent/60" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
