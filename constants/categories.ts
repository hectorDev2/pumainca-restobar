/**
 * Categorías de productos
 */

export const PRODUCT_CATEGORIES = [
  { id: "todo", name: "Todo el Menú", icon: "restaurant" },
  {
    id: "platos-principales",
    name: "Platos Principales",
    icon: "dinner_dining",
  },
  { id: "platos-vegetarianos", name: "Platos Vegetarianos", icon: "spa" },
  { id: "pizzas", name: "Pizzas", icon: "local_pizza" },
  { id: "bebidas", name: "Bebidas", icon: "local_bar" },
  { id: "postres", name: "Postres", icon: "icecream" },
  { id: "comida-rapida", name: "Comida Rápida", icon: "fastfood" },
] as const;

export const DIETARY_FILTERS = ["Vegetariano", "Vegano", "Sin Gluten"] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  "platos-principales": "dinner_dining",
  "platos-vegetarianos": "spa",
  pizzas: "local_pizza",
  bebidas: "local_bar",
  postres: "icecream",
  "comida-rapida": "fastfood",
  todo: "restaurant",
};
