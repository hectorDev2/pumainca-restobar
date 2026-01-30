import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de forma segura
 * Previene conflictos de clases y los resuelve correctamente
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
