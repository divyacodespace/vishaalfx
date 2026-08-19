export function Badge({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "warn" | "gain" | "loss" | "neutral";
}) {
  const toneClasses: Record<string, string> = {
    accent: "bg-accent/10 text-accent border-accent/30",
    warn: "bg-warn/10 text-warn border-warn/30",
    gain: "bg-gain/10 text-gain border-gain/30",
    loss: "bg-loss/10 text-loss border-loss/30",
    neutral: "bg-white/5 text-white/70 border-white/15",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
