// ponytail: Native HTML label wrapper.
import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ children, className = "", required, ...props }: LabelProps) {
  return (
    <label
      className={`block text-sm font-semibold uppercase tracking-wider text-[var(--fg)] mb-1 ${className}`.trim()}
      {...props}
    >
      {children}
      {required && <span className="text-[var(--red)] ml-1" aria-hidden="true">*</span>}
    </label>
  );
}
