import type { OrderStatus, PaymentStatus } from "@/types/domain";

// Impuesto General a las Ventas (Perú)
export const IGV_RATE = 0.18;

// Divisor para extraer el neto cuando el precio ya incluye IGV
// Precio con IGV = Neto * (1 + IGV_RATE)  →  Neto = Precio / IGV_DIVISOR
export const IGV_DIVISOR = 1 + IGV_RATE;

export const VALID_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export const VALID_PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "completed",
  "failed",
];
