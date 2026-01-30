/**
 * Patrones y reglas de validación
 */

export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9_-]*$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_INVALID: "El correo electrónico no es válido",
  PHONE_INVALID: "El teléfono no es válido",
  REQUIRED: "Este campo es requerido",
  MIN_LENGTH: (min: number) => `Debe tener al menos ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Debe tener máximo ${max} caracteres`,
  PASSWORD_WEAK: "La contraseña debe tener al menos 8 caracteres",
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ACCEPTED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
} as const;
