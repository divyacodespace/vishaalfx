import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "sm";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-base-950 hover:bg-accent-soft shadow-glow font-semibold",
  secondary:
    "bg-base-800 text-white border border-base-600 hover:border-accent/50 hover:bg-base-700",
  ghost: "text-white/80 hover:text-white hover:bg-white/5",
  danger: "bg-loss/90 text-white hover:bg-loss",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3.5 text-base rounded-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
