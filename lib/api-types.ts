// Tipos para las respuestas de la API

export interface OrderResponse {
  id?: string | number;
  order_number?: string;
  number?: string;
  orderNumber?: string;
  status?: string;
  message?: string;
}

export interface ReservationResponse {
  id?: string;
  reservation_code?: string;
  code?: string;
  message?: string;
  text?: string;
  status?: string;
}
