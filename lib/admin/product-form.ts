import type { Product } from "@/types";

export type ProductFormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  subcategoryName: string;
  isAvailable: boolean;
  isChefSpecial: boolean;
  isRecommended: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  isGlutenFree: boolean;
  isVariablePrice: boolean;
  preparationTimeMinutes: string;
};

export const initialFormState: ProductFormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  subcategory: "",
  subcategoryName: "",
  isAvailable: true,
  isChefSpecial: false,
  isRecommended: false,
  isVegetarian: false,
  isSpicy: false,
  isGlutenFree: false,
  isVariablePrice: false,
  preparationTimeMinutes: "",
};

export const booleanFlagOptions: Array<{
  label: string;
  field: keyof ProductFormState;
}> = [
  { label: "Disponible", field: "isAvailable" },
  { label: "Chef Special", field: "isChefSpecial" },
  { label: "Recomendado", field: "isRecommended" },
  { label: "Vegetariano", field: "isVegetarian" },
  { label: "Picante", field: "isSpicy" },
  { label: "Sin Gluten", field: "isGlutenFree" },
];

const parsePriceValue = (value?: number | string) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const resolveProductPrice = (
  price?: number | string | Record<string, number | string>,
) => {
  if (typeof price === "number") return price;
  if (typeof price === "string") return parsePriceValue(price) ?? 0;
  if (price && typeof price === "object") {
    const values = Object.values(price)
      .map(parsePriceValue)
      .filter((v): v is number => typeof v === "number");
    return values.length > 0 ? Math.min(...values) : 0;
  }
  return 0;
};

export const resolveImage = (product?: Product) =>
  product?.image_url || product?.gallery?.[0] || "/logo.png";

export const buildProductFormState = (product: Product): ProductFormState => ({
  name: product.name,
  description: product.description ?? "",
  price: resolveProductPrice(product.price).toFixed(2),
  category: product.category ?? "",
  subcategory: product.subcategory ?? "",
  subcategoryName:
    (product as any).subcategory_name ?? (product as any).subcategoryName ?? "",
  isAvailable: !!product.isAvailable,
  isChefSpecial: !!product.isChefSpecial,
  isRecommended: !!product.isRecommended,
  isVegetarian: !!product.isVegetarian,
  isSpicy: !!product.isSpicy,
  isGlutenFree: !!product.isGlutenFree,
  isVariablePrice: !!(
    (product as any).is_variable_price ?? (product as any).isVariablePrice
  ),
  preparationTimeMinutes: String(
    (product as any).preparation_time_minutes ??
      (product as any).preparationTimeMinutes ??
      "",
  ),
});

export const buildProductFormData = (
  state: ProductFormState,
  mainImage?: File | null,
) => {
  const formPayload = new FormData();
  formPayload.append("name", state.name.trim());
  formPayload.append("description", state.description.trim());
  if (state.price) formPayload.append("price", state.price);
  if (state.category) formPayload.append("category_id", state.category);
  if (state.subcategory) formPayload.append("subcategory_id", state.subcategory);
  if (state.subcategoryName)
    formPayload.append("subcategory_name", state.subcategoryName);

  formPayload.append("is_variable_price", String(state.isVariablePrice));
  formPayload.append("is_available", String(state.isAvailable));
  formPayload.append("is_vegetarian", String(state.isVegetarian));
  formPayload.append("is_spicy", String(state.isSpicy));
  formPayload.append("is_gluten_free", String(state.isGlutenFree));
  formPayload.append("is_chef_special", String(state.isChefSpecial));
  formPayload.append("is_recommended", String(state.isRecommended));

  if (state.preparationTimeMinutes)
    formPayload.append(
      "preparation_time_minutes",
      state.preparationTimeMinutes,
    );

  if (mainImage) formPayload.append("image", mainImage);

  return formPayload;
};
