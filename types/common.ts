/**
 * Common Types
 * Tipos compartidos y utilitarios
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "customer" | "guest";
  createdAt: string;
}

export interface SiteSettings {
  footer_description?: string;
  contact_address?: string;
  contact_phone?: string;
  opening_hours?: {
    day: string;
    open: string;
    close: string;
  }[];
}

export interface FileUploadResult {
  url: string;
  path: string;
  size: number;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
