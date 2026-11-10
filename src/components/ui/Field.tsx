// ponytail: Native input/textarea wrapper with accessibility attributes.
import React from "react";
import { Label } from "./Label";

export interface FieldProps {
  id: string;
  label: string;
  type?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const Field = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FieldProps>(
  (
    {
      id,
      label,
      type = "text",
      name,
      value,
      defaultValue,
      placeholder,
      required,
      error,
      multiline = false,
      rows = 4,
      className = "",
      onChange,
      onBlur,
    },
    ref
  ) => {
    const errorId = `${id}-error`;
    const inputBaseClasses =
      "w-full px-3 py-2.5 bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors";

    const errorClasses = error ? "border-[var(--red)] ring-1 ring-[var(--red)]" : "";

    return (
      <div className={`flex flex-col ${className}`}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            name={name || id}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            required={required}
            rows={rows}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={`${inputBaseClasses} ${errorClasses} resize-y`}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            name={name || id}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={`${inputBaseClasses} ${errorClasses} min-h-[44px]`}
          />
        )}
        {error && (
          <p id={errorId} className="mt-1 text-sm font-medium text-[var(--red)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Field.displayName = "Field";
