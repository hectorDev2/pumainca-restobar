/**
 * UI Types
 * Tipos relacionados con la interfaz de usuario
 */

export type Screen =
  | "home"
  | "menu"
  | "dish-detail"
  | "cart"
  | "checkout"
  | "nosotros"
  | "reservas";

export type Theme = "light" | "dark";

export interface ButtonVariant {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  sortBy?: "name" | "price" | "popularity";
  sortOrder?: "asc" | "desc";
  dietary?: string[];
}
