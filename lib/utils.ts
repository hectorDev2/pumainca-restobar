import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | { [key: string]: number } | undefined): string {
  if (!price) return "S./0.00";
  if (typeof price === "number") {
    return `S./${price.toFixed(2)}`;
  }
  const firstPrice = Object.values(price)[0];
  return `S./${firstPrice.toFixed(2)}`;
}
