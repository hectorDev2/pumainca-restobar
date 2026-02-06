// Tipos para las respuestas de la API

export interface OrderResponse {
  id?: string;
  number?: string;
  orderNumber?: string;
  message?: string;
  [key: string]: any;
}

export interface ReservationResponse {
  id?: string;
  reservation_code?: string;
  code?: string;
  message?: string;
  text?: string;
  [key: string]: any;
}
