/**
 * Tipos específicos del dominio de bebidas
 */

export interface Drink {
  id: string;
  name: string;
  description?: string;
  price: number | Record<string, number>;
  image_url?: string;
  gallery?: string[];
  ingredients?: string[];
  category?: string;
}

export type DrinkPricing = number | Record<string, number>;

export interface FlavorProfile {
  profiles: string[];
  molecular: string;
  intensity: number;
}

export interface DrinkStats {
  molecular: string;
  intensity: number;
  profile: string[];
}
