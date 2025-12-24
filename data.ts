import { Category, Product, SubCategory } from './types';

// --- CATEGORIES ---
export const categories: Category[] = [
  {
    id: "platos-principales",
    name: "Platos Principales",
    description: "Nuestras especialidades principales",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "platos-vegetarianos",
    name: "Platos Vegetarianos",
    description: "Deliciosas opciones vegetarianas",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pizzas",
    name: "Pizzas",
    description: "Pizzas con un toque andino",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "bebidas",
    name: "Bebidas",
    description: "Bebidas y cocteles",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
    subcategories: [
      { id: "bebidas-calientes", name: "Bebidas Calientes", description: "Cafés y tés" },
      { id: "cocteles", name: "Cocteles", description: "Cocteles tradicionales y de la casa" },
      { id: "limonadas-jugos", name: "Limónadas y Jugos", description: "Bebidas refrescantes" },
    ],
  },
  {
    id: "postres",
    name: "Postres",
    description: "Dulces tentaciones",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
  },
];

// --- PRODUCTS ---
export const products: Product[] = [
  // --- PLATOS PRINCIPALES ---
  {
    id: "chanchito-oriental",
    name: "Chanchito Oriental",
    description: "Chanchito suave hecho en salsa oriental, acompañado de arroz estilo wok y verduras.",
    price: 25.0,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    category: "platos-principales",
    ingredients: ["Chanchito (cerdo)", "salsa oriental", "arroz", "verduras variadas"],
    isChefSpecial: true
  },
  {
    id: "chaufa",
    name: "Chaufa (Opcional)",
    description: "Arroz chifa con pollo, chancho, carne, mariscos.",
    price: 20.0,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    category: "platos-principales",
    ingredients: ["Arroz chifa", "pollo", "cerdo", "carne de res", "mariscos"],
  },
  {
    id: "ceviche-tradicional",
    name: "Ceviche Tradicional",
    description: "Trucha, jugo de limón, acompañado con choclo, camote, maíz chulipi y lechuga.",
    price: 28.0,
    image: "https://images.unsplash.com/photo-1535914254981-40b3b426a849?auto=format&fit=crop&w=800&q=80",
    category: "platos-principales",
    ingredients: ["Trucha", "jugo de limón", "choclo", "camote", "maíz chulipi", "lechuga"],
    allergens: ["Pescado"],
    isRecommended: true
  },
  {
    id: "milanesa-pollo",
    name: "Milanesa de Pollo",
    description: "Filete de pollo apanado con huevo, harina, panko, acompañado de fetuccine a la crema.",
    price: 22.0,
    image: "https://images.unsplash.com/photo-1621257962483-35f991f86d87?auto=format&fit=crop&w=800&q=80",
    category: "platos-principales",
    ingredients: ["Filete de pollo", "huevo", "harina", "panko", "fetuccine", "crema"],
  },
  {
    id: "fetuccine-andino",
    name: "Fetuccine Andino",
    description: "Fetuccine con salsa de huancaina, acompañado con lomo saltado.",
    price: 24.0,
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
    category: "platos-principales",
    ingredients: ["Fetuccine", "salsa de huancaina", "lomo de res"],
  },
  {
    id: "fetuccine-verde-lomo",
    name: "Fetuccine Verde con Lomo",
    description: "Fetuccine en salsa pesto criollo de espinacas y albahaca, servida con lomo al grill.",
    price: 26.0,
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80",
    category: "platos-principales",
    ingredients: ["Fetuccine", "espinacas", "albahaca", "lomo de res"],
  },
  {
    id: "lomo-saltado",
    name: "Lomo Saltado",
    description: "Lomo fino macerado en especias, salteado con cebolla y tomate, servido con arroz y papas andinas.",
    price: 30.0,
    image: "https://images.unsplash.com/photo-1560122709-b68df419bf8a?auto=format&fit=crop&w=800&q=80",
    category: "platos-principales",
    ingredients: ["Lomo de res", "cebolla", "tomate", "ají amarillo", "arroz", "papas andinas"],
    isRecommended: true
  },
  {
    id: "cuy-chactao",
    name: "Cuy Chactao",
    description: "Cuy crocante acompañado de papas nativas, salsa criolla y cremosa uchucuta.",
    price: 35.0,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    category: "platos-principales",
    ingredients: ["Cuy", "papas nativas", "salsa criolla", "uchucuta"],
    isChefSpecial: true
  },

  // --- PLATOS VEGETARIANOS ---
  {
    id: "palta-rellena",
    name: "Palta Rellena",
    description: "Palta cremosa rellena de verduras cocidas, mayonesa, queso, huevo, aceituna.",
    price: 15.0,
    image: "https://images.unsplash.com/photo-1525385133512-2f346b38435d?auto=format&fit=crop&w=800&q=80",
    category: "platos-vegetarianos",
    ingredients: ["Palta", "verduras cocidas", "mayonesa", "queso", "huevo"],
    isVegetarian: true,
  },
  {
    id: "estofado-verduras",
    name: "Estofado de Verduras",
    description: "Zanahoria, zucchini, habas, brócoli y champiñones en salsa de tomate, con arroz.",
    price: 19.0,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    category: "platos-vegetarianos",
    ingredients: ["Zanahoria", "zucchini", "habas", "brócoli", "champiñones", "arroz"],
    isVegetarian: true,
  },

  // --- PIZZAS (Precios por tamaño) ---
  {
    id: "pizza-roemix",
    name: "Pizza Roemix",
    description: "Salsa de tomate, pepperoni, queso mozzarella, pollo deshilachado y tocino.",
    price: { pequeño: 15.0, mediano: 29.0, familiar: 40.0 },
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    category: "pizzas",
    ingredients: ["Tomate", "pepperoni", "mozzarella", "pollo", "tocino"],
    allergens: ["Gluten", "Lácteos"],
  },
  {
    id: "pizza-alpaca",
    name: "Pizza Alpaca",
    description: "Alpaca y pepperoni con salsa de tomate.",
    price: { pequeño: 16.0, mediano: 28.0, familiar: 39.0 },
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    category: "pizzas",
    ingredients: ["Alpaca", "pepperoni", "salsa de tomate", "queso mozzarella"],
    allergens: ["Gluten", "Lácteos"],
    isChefSpecial: true
  },

  // --- BEBIDAS ---
  {
    id: "pisco-sour",
    name: "Pisco Sour",
    description: "Coctel tradicional peruano.",
    price: 10.0,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    category: "bebidas",
    subcategory: "cocteles",
    ingredients: ["Pisco", "limón", "clara de huevo", "jarabe de goma"],
  },
  {
    id: "chicha-morada",
    name: "Chicha Morada",
    description: "Bebida tradicional de maíz morado.",
    price: 5.0,
    image: "https://images.unsplash.com/photo-1582236894042-32b000b95eb7?auto=format&fit=crop&w=800&q=80",
    category: "bebidas",
    subcategory: "limonadas-jugos",
    ingredients: ["Maíz morado", "piña", "limón", "canela"],
  },

  // --- POSTRES ---
  {
    id: "mouse-mango",
    name: "Mousse de Mango",
    description: "Suave mousse de mango natural.",
    price: 12.0,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28df8?auto=format&fit=crop&w=800&q=80",
    category: "postres",
    ingredients: ["Mango", "crema", "leche condensada"],
    allergens: ["Lácteos"],
  },
];

// --- BACKWARD COMPATIBILITY & UTILS ---
export const DISHES = products; // Alias for legacy code

export function getProductsByCategory(categoryId: string, subcategoryId?: string): Product[] {
  if (subcategoryId) {
    return products.filter(
      (p) => p.category === categoryId && p.subcategory === subcategoryId
    );
  }
  return products.filter((p) => p.category === categoryId);
}

export async function getProduct(productId: string): Promise<Product | undefined> {
  return products.find((p) => p.id === productId);
}

export async function getCategory(categoryId: string): Promise<Category | undefined> {
  return categories.find((c) => c.id === categoryId);
}

export function getSubcategories(categoryId: string): SubCategory[] | undefined {
  const category = categories.find((c) => c.id === categoryId);
  return category?.subcategories;
}
