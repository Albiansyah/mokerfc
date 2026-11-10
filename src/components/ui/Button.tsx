import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "ghost" | "outline-white";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      href,
      isExternal,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 rounded-lg";

    const sizeClasses = {
      sm: "min-h-10 px-4 py-2 text-sm",
      md: "min-h-12 px-6 py-2.5 text-base",
      lg: "min-h-14 px-8 py-3 text-lg",
    }[size];

    const variantClasses = {
      primary:
        "bg-red text-white hover:bg-red-700 active:bg-red-800 focus-visible:outline-red",
      secondary:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-slate-400",
      gold: "bg-gold text-navy hover:bg-yellow-500 active:bg-yellow-600 focus-visible:outline-gold",
      ghost:
        "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-slate-400",
      "outline-white":
        "border-2 border-white/30 bg-transparent text-white hover:bg-white/10 active:bg-white/20 focus-visible:outline-white",
    }[variant];

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer";
    const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`.trim();

    if (href) {
      if (isExternal || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("https://wa.me")) {
        return (
          <a
            href={href}
            className={combinedClasses}
            target={isExternal || href.startsWith("http") ? "_blank" : undefined}
            rel={isExternal || href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClasses}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClasses} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";