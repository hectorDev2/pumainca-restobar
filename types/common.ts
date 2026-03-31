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
  // Hero section
  hero_title?: string;
  hero_subtitle?: string;
  hero_description?: string;
  hero_background_image?: string;
  // History section
  history_label?: string;
  history_title?: string;
  history_description?: string;
  history_image?: string;
  // Philosophy section
  philosophy_label?: string;
  philosophy_title?: string;
  philosophy_description?: string;
  philosophy_image?: string;
  philosophy_badge_1?: string;
  philosophy_badge_2?: string;
  // CTA section
  cta_background_image?: string;
  // Schedule
  schedule_weekday?: string;
  schedule_weekday_hours?: string;
  schedule_weekend?: string;
  schedule_weekend_hours?: string;
  schedule_closed_day?: string;
  // Contact & footer
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
