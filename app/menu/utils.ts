import type { Product } from "@/types";

export type SortOption = "recommended" | "price_asc" | "price_desc" | "alphabetical";

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Más recomendados" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "alphabetical", label: "Orden alfabético" },
];

const parsePriceValue = (value?: number | string): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const resolvePrice = (
  price?: number | string | Record<string, number | string>
): number => {
  if (typeof price === "number") return price;

  if (price && typeof price === "object") {
    const values = Object.values(price)
      .map(parsePriceValue)
      .filter((v): v is number => typeof v === "number");
    if (values.length > 0) return Math.min(...values);
  }

  if (typeof price === "string") {
    const parsed = parsePriceValue(price);
    if (parsed !== undefined) return parsed;
  }

  return 0;
};

export const priceLabel = (dish: Product): string => {
  const numericPrice = resolvePrice(dish?.price);
  return numericPrice > 0 ? `S./${numericPrice.toFixed(2)}` : "S./0.00";
};

export const resolveDishImage = (dish?: Product): string | undefined =>
  dish?.image_url;
