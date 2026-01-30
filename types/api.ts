/**
 * API Types
 * Payloads y respuestas de API
 */

import type { OrderItem, OrderStatus, ReservationStatus } from "./domain";

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  specialInstructions: string;
}

export interface OrderItemPayload extends OrderItem {}

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
}

export interface OrderUpdatePayload {
  status?: OrderStatus;
  notes?: string;
}

export interface ReservationPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
}

export interface ReservationUpdatePayload {
  status?: ReservationStatus;
  notes?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
