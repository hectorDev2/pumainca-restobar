export interface SubCategory {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories?: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | { [key: string]: number };
  category: string;
  subcategory?: string;
  image: string;
  image_url?: string;
  gallery?: string[];
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isGlutenFree?: boolean;
  isChefSpecial?: boolean;
  isRecommended?: boolean;
  isAvailable?: boolean;
}

// Alias for backward compatibility during refactor
export type Dish = Product;

export interface CartItem {
  dish: Product;
  quantity: number;
  selectedSize?: string;
  options?: {
    cookingPoint?: string;
    extras?: string[];
    preferences?: string[];
    specialInstructions?: string;
  };
}

export type Screen = "home" | "menu" | "dish-detail" | "cart" | "checkout" | "nosotros" | "reservas";
