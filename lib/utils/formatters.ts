/**
 * Utilidades para formateo de datos
 */

/**
 * Resuelve el precio real de un producto (maneja múltiples tamaños)
 * @param price - Precio numérico o objeto con precios por tamaño
 * @returns Precio numérico (el mínimo si hay múltiples)
 */
export function resolvePrice(
  price?: number | Record<string, number>,
): number {
  if (typeof price === "number") {
    return price;
  }

  if (price && typeof price === "object") {
    const values = Object.values(price).filter(
      (value): value is number => typeof value === "number",
    );
    if (values.length > 0) {
      return Math.min(...values);
    }
  }

  return 0;
}

/**
 * Formatea un precio para mostrar (S./ formato Perú)
 * @param price - Precio numérico o con múltiples tamaños
 * @returns Precio formateado como string
 */
export function formatPrice(
  price: number | { [key: string]: number } | undefined,
): string {
  if (!price) return "S./0.00";
  if (typeof price === "number") {
    return `S./${price.toFixed(2)}`;
  }
  const firstPrice = Object.values(price)[0];
  return `S./${firstPrice.toFixed(2)}`;
}

export function formatDate(
  date: string | Date,
  locale: string = "es-PE",
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
}

export function formatTime(
  date: string | Date,
  locale: string = "es-PE",
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateTax(amount: number, taxRate: number = 0.18): number {
  return amount * taxRate;
}

export function calculateTotal(
  subtotal: number,
  taxRate: number = 0.18,
  serviceFee: number = 0,
): number {
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax + serviceFee;
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
