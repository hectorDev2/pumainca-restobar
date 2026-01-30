"use client";

import React from "react";

interface FormErrorProps {
  message: string;
  title?: string;
  onClose?: () => void;
}

/**
 * Componente de error de formulario
 * Responsabilidad única: mostrar mensaje de error
 */
const FormError: React.FC<FormErrorProps> = ({
  message,
  title = "Error",
  onClose,
}) => {
  return (
    <div
      aria-live="assertive"
      className="fixed right-4 bottom-4 z-50 max-w-xs bg-red-700 text-white px-4 py-3 rounded-lg shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm mt-1">{message}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-red-200 transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default FormError;
