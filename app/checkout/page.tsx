"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types";
import { API_BASE_URL } from "@/lib/api";

type ContactInfo = {
  name: string;
  email: string;
  phone: string;
  specialInstructions: string;
};

type OrderItemPayload = {
  product_id: string;
  quantity: number;
  unit_price: number;
  selected_size?: string;
  cooking_point?: string;
  special_instructions?: string;
};

type OrderPayload = {
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
};

type OrderConfirmation = {
  number?: string;
  message?: string;
};

const createInitialContactInfo = (): ContactInfo => ({
  name: "",
  email: "",
  phone: "",
  specialInstructions: "",
});

const pickupEstimateLabels: Record<"20m" | "45m" | "1h", string> = {
  "20m": "Lo antes posible (20m)",
  "45m": "En 45 minutos",
  "1h": "En 1 hora",
};

const pickupOptions = [
  { value: "20m", label: "Lo antes posible (20m)" },
  { value: "45m", label: "En 45 minutos" },
  { value: "1h", label: "En 1 hora" },
];

const CheckoutHeader = () => (
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

export default function CheckoutPage() {
  const { cart, cartTotal: totals, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cash">("cash");
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() =>
    createInitialContactInfo()
  );
  const [pickupEstimate, setPickupEstimate] = useState<"20m" | "45m" | "1h">(
    "20m"
  );
  const [orderConfirmation, setOrderConfirmation] =
    useState<OrderConfirmation | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const getItemPrice = (item: CartItem) => {
    if (typeof item.dish.price === "number") return item.dish.price;
    if (item.selectedSize) return (item.dish.price as any)[item.selectedSize];
    return Math.min(...Object.values(item.dish.price as object));
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const field = e.target.name as keyof ContactInfo;
    setContactInfo((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setOrderError(null);
  };

  const handleOrderSubmit = async () => {
    if (cart.length === 0) {
      setOrderError("Agrega al menos un platillo para continuar.");
      return;
    }

    if (!contactInfo.email || !contactInfo.phone) {
      setOrderError("Proporciona tu correo y teléfono para el pedido.");
      return;
    }

    setIsSubmittingOrder(true);
    setOrderError(null);

    const items: OrderItemPayload[] = cart.map((item) => {
      const unitPrice = getItemPrice(item);
      const itemPayload: OrderItemPayload = {
        product_id: item.dish.id,
        quantity: item.quantity,
        unit_price: unitPrice,
      };

      if (item.selectedSize) {
        itemPayload.selected_size = item.selectedSize;
      }

      if (item.options?.cookingPoint) {
        itemPayload.cooking_point = item.options.cookingPoint;
      }

      if (item.options?.specialInstructions) {
        itemPayload.special_instructions = item.options.specialInstructions;
      }

      return itemPayload;
    });

    const payload: OrderPayload = {
      customer_email: contactInfo.email.trim(),
      customer_phone: contactInfo.phone.trim(),
      payment_method: paymentMethod,
      items,
      subtotal: Number(totals.subtotal.toFixed(2)),
      tax_amount: Number(totals.tax.toFixed(2)),
      service_fee: Number(totals.serviceFee.toFixed(2)),
      total_amount: Number(totals.total.toFixed(2)),
    };

    if (contactInfo.name.trim()) {
      payload.customer_name = contactInfo.name.trim();
    }

    if (pickupEstimate) {
      payload.pickup_time_estimate = pickupEstimate;
    }

    if (contactInfo.specialInstructions.trim()) {
      payload.special_instructions = contactInfo.specialInstructions.trim();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ?? "No se pudo confirmar tu pedido en este momento."
        );
      }

      setOrderConfirmation({
        number: data?.number ?? data?.orderNumber ?? data?.id?.toString(),
        message:
          data?.message ?? "Tu pedido fue registrado y está en preparación.",
      });

      clearCart();
    } catch (error) {
      setOrderError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear el pedido."
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleNewOrder = () => {
    setOrderConfirmation(null);
    setOrderError(null);
    setContactInfo(createInitialContactInfo());
    setPickupEstimate("20m");
    setPaymentMethod("cash");
  };

  const pickupLabel = pickupEstimateLabels[pickupEstimate];

  if (orderConfirmation) {
    return (
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
              {orderConfirmation.message} Puedes pasar por PUMAINCA RESTOBAR{" "}
              <strong>{pickupLabel.toLowerCase()}</strong> y traer el correo de
              confirmación al número <strong>{contactInfo.phone}</strong>.
            </p>
            {orderConfirmation.number && (
              <p className="text-white font-semibold tracking-wide">
                Número de pedido: {orderConfirmation.number}
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
                onClick={handleNewOrder}
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
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <CheckoutHeader />
      <main className="grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
            <div>
              <h1 className="text-primary text-3xl md:text-4xl font-black mb-2">
                Finalizar Pedido
              </h1>
              <p className="text-text-secondary">
                Completa los datos para que tu pedido salga del horno cuanto
                antes.
              </p>
            </div>

            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-primary text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">
                    contact_page
                  </span>
                  Información de Contacto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Nombre completo (opcional)
                    </label>
                    <input
                      name="name"
                      value={contactInfo.name}
                      onChange={handleContactChange}
                      type="text"
                      placeholder="Juan Pérez"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Correo electrónico
                    </label>
                    <input
                      required
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      type="email"
                      placeholder="tu@ejemplo.com"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Teléfono
                    </label>
                    <input
                      required
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactChange}
                      type="tel"
                      placeholder="+51 900 000 000"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-primary text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">storefront</span>
                  Detalles de Recogida
                </h2>
                <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                    </div>
                    <div>
                      <h3 className="text-primary font-bold">
                        PUMAINCA RESTOBAR
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Prolongacion Jaquijahuana, al frente de Astral GYM
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <label className="text-xs text-text-secondary block mb-1">
                      Hora estimada
                    </label>
                    <select
                      value={pickupEstimate}
                      onChange={(event) =>
                        setPickupEstimate(
                          event.target.value as "20m" | "45m" | "1h"
                        )
                      }
                      className="w-full md:w-48 bg-black border border-zinc-800 text-white rounded-lg px-3 py-2 outline-none"
                    >
                      {pickupOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-sm font-medium text-text-secondary">
                  Instrucciones especiales (opcional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={contactInfo.specialInstructions}
                  onChange={handleContactChange}
                  rows={3}
                  placeholder="Necesitas cubiertos, alergias o celebraciones"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
                />
              </section>

              <section className="space-y-4">
                <h2 className="text-primary text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">credit_card</span>
                  Método de Pago
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "cash", label: "Pago en Local", icon: "payments" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as "cash")}
                      className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/10"
                          : "border-zinc-800 bg-surface-dark hover:bg-zinc-800"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-3xl ${
                          paymentMethod === method.id
                            ? "text-primary"
                            : "text-zinc-500"
                        }`}
                      >
                        {method.icon}
                      </span>
                      <span
                        className={`font-bold text-sm ${
                          paymentMethod === method.id
                            ? "text-white"
                            : "text-zinc-500"
                        }`}
                      >
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-dark border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 bg-surface-hover/50 border-b border-zinc-800">
                  <h2 className="text-primary font-bold">
                    Resumen de tu Orden
                  </h2>
                  <p className="text-xs text-text-secondary mt-1">
                    {cart.length
                      ? `Pedido para recoger • ${cart.length} item${
                          cart.length === 1 ? "" : "s"
                        }`
                      : "Tu carrito está vacío"}
                  </p>
                </div>
                <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
                  {cart.map((item, index) => {
                    const unitPrice = getItemPrice(item);
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-start"
                      >
                        <div className="flex gap-3">
                          <div
                            className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-zinc-800"
                            style={{
                              backgroundImage: `url('${item.dish.image}')`,
                            }}
                          />
                          <div className="flex flex-col">
                            <p className="text-white font-bold text-sm">
                              {item.dish.name}
                            </p>
                            <p className="text-primary text-xs font-bold">
                              x{item.quantity}
                            </p>
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
                    <span>Subtotal</span>
                    <span className="text-white">
                      S./{totals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>IGV (18%)</span>
                    <span className="text-white">
                      S./{totals.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-sm pb-2">
                    <span>Costo de servicio</span>
                    <span className="text-white">
                      S./{totals.serviceFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-primary font-black text-3xl tracking-tighter">
                      S./{totals.total.toFixed(2)}
                    </span>
                  </div>
                  {orderError && (
                    <p className="text-center text-red-400 text-sm">
                      {orderError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleOrderSubmit}
                    disabled={cart.length === 0 || isSubmittingOrder}
                    className="w-full bg-primary hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all mt-4 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSubmittingOrder ? (
                      <>
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">
                          verified
                        </span>
                        Confirmar Pedido
                      </>
                    )}
                  </button>
                  <p className="text-center text-zinc-600 text-[10px] mt-4 uppercase font-bold tracking-widest">
                    Pago Encriptado y Seguro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
