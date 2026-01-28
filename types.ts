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
  image_url: string;
  gallery?: string[];
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isGlutenFree?: boolean;
  isChefSpecial?: boolean;
  isRecommended?: boolean;
  isAvailable?: boolean;
  preparation_time_minutes?: number;
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

// Checkout Types
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  specialInstructions: string;
}

export interface OrderItemPayload {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  selected_size?: string;
  cooking_point?: string;
  special_instructions?: string;
}

export interface OrderPayload {
  customer_email: string;
  customer_phone: string;
  payment_method: string;
  items: OrderItemPayload[];
  subtotal: number;
  tax_amount: number;
  service_fee: number;
  total_amount: number;
  customer_name?: string;
  pickup_time_estimate?: string;
  special_instructions?: string;
}

export interface OrderConfirmation {
  number?: string;
  message?: string;
}
