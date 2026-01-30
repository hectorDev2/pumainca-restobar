"use client";

import React from "react";

interface FormSubmitButtonProps {
  loading?: boolean;
  text?: string;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * Botón de envío de formulario
 * Responsabilidad única: mostrar estado de carga y desabilitar
 */
const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  loading = false,
  text = "Enviar",
  loadingText = "Procesando...",
  variant = "primary",
  disabled = false,
  onClick,
}) => {
  const variantClass = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  }[variant];

  return (
    <button
      type="submit"
      disabled={loading || disabled}
      onClick={onClick}
      className={`${variantClass} px-4 py-2 rounded-xl font-bold disabled:opacity-50 transition-opacity`}
    >
      {loading ? loadingText : text}
    </button>
  );
};

export default FormSubmitButton;
