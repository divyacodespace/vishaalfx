import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-base-900/60 backdrop-blur-sm ${className}`}
      {...props}
    />
  );
}
