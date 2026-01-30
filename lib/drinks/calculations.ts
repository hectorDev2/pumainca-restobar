/**
 * Cálculos especializados para bebidas
 * Funciones puras para determinar propiedades de bebidas
 */

/**
 * Calcula la fórmula molecular de una bebida basada en ingredientes
 * @param ingredients - Array de ingredientes
 * @returns Fórmula molecular en formato string
 */
export function calculateMolecularFormula(ingredients: string[] = []): string {
  if (!ingredients || ingredients.length === 0) {
    return "C₂H₅OH"; // Etanol por defecto
  }

  const first = ingredients[0]?.substring(0, 1).toUpperCase() || "C";
  const second = ingredients[1]?.substring(0, 1).toUpperCase() || "H";

  return `${first}₂${second}₅OH`;
}

/**
 * Calcula la intensidad de una bebida (0-100)
 * Basado en número de ingredientes y longitud del nombre
 * @param drink - Objeto bebida
 * @returns Intensidad (0-100)
 */
export function calculateIntensity(drink: {
  ingredients?: string[];
  name?: string;
}): number {
  const BASE_INTENSITY = 30;
  const INGREDIENT_BONUS = (drink.ingredients?.length || 0) * 5;
  const NAME_BONUS = (drink.name?.length || 0) % 20;

  return Math.min(100, BASE_INTENSITY + INGREDIENT_BONUS + NAME_BONUS);
}

/**
 * Genera el perfil de sabor de una bebida
 * Analiza el nombre e ingredientes para determinar sabores
 * @param drink - Objeto bebida
 * @returns Array de perfiles de sabor
 */
export function generateFlavorProfile(drink: {
  name?: string;
  ingredients?: string[];
}): string[] {
  const FLAVOR_OPTIONS = [
    "Cítrico",
    "Dulce",
    "Amargo",
    "Ácido",
    "Picante",
    "Suave",
    "Intenso",
  ] as const;

  const selected = new Set<string>();
  const name = (drink.name || "").toLowerCase();

  // Mapeo de palabras clave a sabores
  const keywordMap: Record<string, string> = {
    sour: "Cítrico",
    limón: "Cítrico",
    sweet: "Dulce",
    dulce: "Dulce",
    bitter: "Amargo",
    amargo: "Amargo",
    spicy: "Picante",
    picante: "Picante",
    smooth: "Suave",
    suave: "Suave",
    strong: "Intenso",
    intenso: "Intenso",
  };

  // Buscar palabras clave en el nombre
  Object.entries(keywordMap).forEach(([keyword, flavor]) => {
    if (name.includes(keyword)) {
      selected.add(flavor);
    }
  });

  // Analizar ingredientes
  if (drink.ingredients) {
    drink.ingredients.forEach((ingredient) => {
      const ingLower = ingredient.toLowerCase();
      if (ingLower.includes("limón") || ingLower.includes("naranja")) {
        selected.add("Cítrico");
      }
      if (ingLower.includes("miel") || ingLower.includes("azúcar")) {
        selected.add("Dulce");
      }
      if (ingLower.includes("jengibre") || ingLower.includes("chile")) {
        selected.add("Picante");
      }
    });
  }

  // Agregar sabores aleatorios si necesario (mínimo 2)
  while (selected.size < 2 && selected.size < FLAVOR_OPTIONS.length) {
    const random =
      FLAVOR_OPTIONS[Math.floor(Math.random() * FLAVOR_OPTIONS.length)];
    selected.add(random);
  }

  return Array.from(selected);
}
