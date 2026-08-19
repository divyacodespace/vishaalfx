import { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
}

export function Checkbox({ label, className = "", id, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer select-none group">
      <input
        id={id}
        type="checkbox"
        className={`vfx-checkbox mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-white/30 bg-base-800 ${className}`}
        {...props}
      />
      <span className="text-sm text-white/80 leading-relaxed group-hover:text-white/95">{label}</span>
    </label>
  );
}
