import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary:
      "bg-cyan-300 text-stone-950 hover:bg-cyan-200 disabled:bg-stone-700 disabled:text-stone-400",
    secondary:
      "border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:border-white/5 disabled:text-stone-500",
    ghost: "text-stone-300 hover:text-white"
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
