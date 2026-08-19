import { Card } from "@/components/ui/Card";

export function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mx-auto w-full max-w-xl p-8 animate-fade-up">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-white/55">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </Card>
  );
}

export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-loss">{message}</p>;
}
