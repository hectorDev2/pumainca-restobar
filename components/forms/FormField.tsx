"use client";

import React from "react";

interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  as?: "input" | "textarea" | "select";
  rows?: number;
  children?: React.ReactNode;
}

/**
 * Campo de formulario genérico y reutilizable
 * Responsabilidad única: renderizar un input/textarea con estilos
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  helperText,
  as = "input",
  rows,
  className = "",
  ...props
}) => {
  const baseClass =
    "w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2 text-text-primary focus:border-primary outline-none transition-colors";

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-zinc-400 mb-2">
        {label}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          className={`${baseClass} ${className} ${error ? "border-red-500" : ""}`}
          rows={rows}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === "select" ? (
        <select
          id={id}
          className={`${baseClass} ${className} ${error ? "border-red-500" : ""}`}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={id}
          className={`${baseClass} ${className} ${error ? "border-red-500" : ""}`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helperText && <p className="mt-1 text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};

export default FormField;
