/**
 * Domain Types
 * Core entities del negocio: Productos, Categorías, Pedidos, Reservas
 */

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

// Alias para compatibilidad durante refactor
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

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  selected_size?: string;
  cooking_point?: string;
  special_instructions?: string;
}

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: ReservationStatus;
  created_at: string;
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";
