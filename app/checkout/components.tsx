import React from "react";
import Link from "next/link";
import { OrderConfirmation, CartItem } from "@/types";
import { getItemPrice } from "./utils";

export const CheckoutHeader = () => (
  <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-background-dark/95 backdrop-blur px-6 md:px-10 py-3">
    <Link href="/" className="flex items-center gap-4 text-white">
      <img src="/logo.png" className="w-[120px]" alt="Pumainca" />
    </Link>
    <div className="flex items-center gap-6">
      <Link
        href="/cart"
        className="text-text-secondary hover:text-white text-sm font-medium transition-colors hidden sm:block"
      >
        Volver al Carrito
      </Link>
      <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
        <span className="material-symbols-outlined text-primary text-[18px]">
          lock
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-white">
          Pago Seguro
        </span>
      </div>
    </div>
  </header>
);

export const OrderConfirmationView: React.FC<{
  confirmation: OrderConfirmation;
  pickupLabel: string;
  contactPhone: string;
  onNewOrder: () => void;
}> = ({ confirmation, pickupLabel, contactPhone, onNewOrder }) => (
  <div className="min-h-screen bg-black">
    <CheckoutHeader />
    <div className="pt-20 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="max-w-md w-full px-4 text-center animate-fade-in-up space-y-6">
        <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-4xl text-green-500">
            check_circle
          </span>
        </div>
        <h2 className="text-3xl font-bold text-text-primary">
          ¡Pedido Confirmado!
        </h2>
        <p className="text-text-secondary">
          {confirmation.message} Puedes pasar por PUMAINCA RESTOBAR{" "}
          <strong>{pickupLabel.toLowerCase()}</strong> después de que reciba la llamada al número <strong>{contactPhone}</strong>.
        </p>
        {confirmation.number && (
          <p className="text-white font-semibold tracking-wide">
            Número de pedido: {confirmation.number}
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center"
          >
            Volver al Inicio
          </Link>
          <button
            onClick={onNewOrder}
            className="text-text-secondary hover:text-text-primary px-8 py-3 font-semibold transition-colors"
            type="button"
          >
            Hacer otro pedido
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const OrderSummary: React.FC<{
  cart: CartItem[];
  totals: { subtotal: number; tax: number; serviceFee: number; total: number };
  error: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}> = ({ cart, totals, error, isSubmitting, onSubmit }) => (
  <div className="bg-surface-dark border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
    <div className="p-6 bg-surface-hover/50 border-b border-zinc-800">
      <h2 className="text-primary font-bold">Resumen de tu Orden</h2>
      <p className="text-xs text-text-secondary mt-1">
        {cart.length
          ? `Pedido para recoger • ${cart.length} item${cart.length === 1 ? "" : "s"}`
          : "Tu carrito está vacío"}
      </p>
    </div>
    <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
      {cart.map((item, index) => {
        const unitPrice = getItemPrice(item);
        return (
          <div key={index} className="flex justify-between items-start">
            <div className="flex gap-3">
              <div
                className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-zinc-800"
                style={{ backgroundImage: `url('${item.dish.image_url}')` }}
              />
              <div className="flex flex-col">
                <p className="text-white font-bold text-sm">{item.dish.name}</p>
                <p className="text-primary text-xs font-bold">x{item.quantity}</p>
              </div>
            </div>
            <span className="text-white font-medium text-sm">
              S./{(unitPrice * item.quantity).toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
    <div className="p-6 bg-black/50 border-t border-zinc-800 space-y-3">
      <div className="flex justify-between text-zinc-500 text-sm">
        <span>Subtotal (Sin IGV)</span>
        <span className="text-white">S./{totals.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-zinc-500 text-sm">
        <span>IGV (18%)</span>
        <span className="text-white">S./{totals.tax.toFixed(2)}</span>
      </div>
      <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
        <span className="text-white font-bold text-lg">Total</span>
        <span className="text-primary font-black text-3xl tracking-tighter">
          S./{totals.total.toFixed(2)}
        </span>
      </div>
      {error && (
        <p className="text-center text-red-400 text-sm">{error}</p>
      )}
      <button
        type="button"
        onClick={onSubmit}
        disabled={cart.length === 0 || isSubmitting}
        className="w-full bg-primary hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all mt-4 active:scale-95 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">verified</span>
            Confirmar Pedido
          </>
        )}
      </button>
      <p className="text-center text-zinc-600 text-[10px] mt-4 uppercase font-bold tracking-widest">
        Pago Encriptado y Seguro
      </p>
    </div>
  </div>
);
