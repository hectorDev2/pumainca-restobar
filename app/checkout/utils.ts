import { CartItem, ContactInfo } from "@/types";

export const createInitialContactInfo = (): ContactInfo => ({
  name: "",
  email: "",
  phone: "",
  specialInstructions: "",
});

export const pickupEstimateLabels: Record<"20m" | "45m" | "1h", string> = {
  "20m": "Lo antes posible (20m)",
  "45m": "En 45 minutos",
  "1h": "En 1 hora",
};

export const pickupOptions = [
  { value: "20m", label: "Lo antes posible (20m)" },
  { value: "45m", label: "En 45 minutos" },
  { value: "1h", label: "En 1 hora" },
];

export const getItemPrice = (item: CartItem): number => {
  if (typeof item.dish.price === "number") return item.dish.price;
  const priceMap = item.dish.price as Record<string, number>;
  if (item.selectedSize) return priceMap[item.selectedSize] ?? 0;
  return Math.min(...Object.values(priceMap));
};
