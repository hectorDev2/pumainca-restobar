import { VALIDATION, VALIDATION_MESSAGES } from "@/constants/validation";

/**
 * Utilidades para validación de datos
 */

export function validateEmail(email: string): boolean {
  return VALIDATION.EMAIL.test(email);
}

export function validatePhone(phone: string): boolean {
  return VALIDATION.PHONE.test(phone);
}

export function validateRequired(value: any): boolean {
  return value !== null && value !== undefined && value !== "";
}

export function validateMinLength(value: string, min: number): boolean {
  return value.length >= min;
}

export function validateMaxLength(value: string, max: number): boolean {
  return value.length <= max;
}

export interface FormValidationRules {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
  };
}

export interface FormValidationErrors {
  [key: string]: string;
}

/**
 * Valida un formulario contra reglas definidas
 */
export function validateForm(
  values: Record<string, any>,
  rules: FormValidationRules,
): FormValidationErrors {
  const errors: FormValidationErrors = {};

  Object.keys(rules).forEach((fieldName) => {
    const value = values[fieldName];
    const rule = rules[fieldName];

    // Validación requerida
    if (rule.required && !validateRequired(value)) {
      errors[fieldName] = VALIDATION_MESSAGES.REQUIRED;
      return;
    }

    // Si no es requerido y está vacío, no validar más
    if (!rule.required && !validateRequired(value)) {
      return;
    }

    // Validación de longitud mínima
    if (
      rule.minLength &&
      typeof value === "string" &&
      !validateMinLength(value, rule.minLength)
    ) {
      errors[fieldName] = VALIDATION_MESSAGES.MIN_LENGTH(rule.minLength);
      return;
    }

    // Validación de longitud máxima
    if (
      rule.maxLength &&
      typeof value === "string" &&
      !validateMaxLength(value, rule.maxLength)
    ) {
      errors[fieldName] = VALIDATION_MESSAGES.MAX_LENGTH(rule.maxLength);
      return;
    }

    // Validación con patrón regex
    if (
      rule.pattern &&
      typeof value === "string" &&
      !rule.pattern.test(value)
    ) {
      errors[fieldName] = `${fieldName} tiene un formato inválido`;
      return;
    }

    // Validación personalizada
    if (rule.custom && !rule.custom(value)) {
      errors[fieldName] = `${fieldName} no es válido`;
      return;
    }
  });

  return errors;
}
