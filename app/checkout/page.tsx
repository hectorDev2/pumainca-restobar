"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ContactInfo, OrderItemPayload, OrderPayload, OrderConfirmation } from "@/types";
import { API_BASE_URL } from "@/lib/api";
import { 
  createInitialContactInfo, 
  pickupEstimateLabels, 
  pickupOptions, 
  getItemPrice 
} from "./utils";
import { 
  CheckoutHeader, 
  OrderConfirmationView, 
  OrderSummary 
} from "./components";

export default function CheckoutPage() {
  const { cart, cartTotal: totals, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cash">("cash");
  const [contactInfo, setContactInfo] = useState<ContactInfo>(createInitialContactInfo);
  const [pickupEstimate, setPickupEstimate] = useState<"20m" | "45m" | "1h">("20m");
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as keyof ContactInfo;
    setContactInfo((prev) => ({ ...prev, [field]: e.target.value }));
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
      const subtotal = Number((unitPrice * item.quantity).toFixed(2));
      const itemPayload: OrderItemPayload = {
        product_id: item.dish.id,
        product_name: item.dish.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: subtotal,
      };
      if (item.selectedSize) itemPayload.selected_size = item.selectedSize;
      if (item.options?.cookingPoint) itemPayload.cooking_point = item.options.cookingPoint;
      if (item.options?.specialInstructions) itemPayload.special_instructions = item.options.specialInstructions;
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

    if (contactInfo.name.trim()) payload.customer_name = contactInfo.name.trim();
    if (pickupEstimate) payload.pickup_time_estimate = pickupEstimate;
    if (contactInfo.specialInstructions.trim()) payload.special_instructions = contactInfo.specialInstructions.trim();

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message ?? "No se pudo confirmar tu pedido en este momento.");
      }

      setOrderConfirmation({
        number: data?.number ?? data?.orderNumber ?? data?.id?.toString(),
        message: data?.message ?? "Tu pedido fue registrado y en breve te contactaremos.",
      });

      clearCart();
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : "Ocurrió un error al crear el pedido.");
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

  if (orderConfirmation) {
    return (
      <OrderConfirmationView
        confirmation={orderConfirmation}
        pickupLabel={pickupEstimateLabels[pickupEstimate]}
        contactPhone={contactInfo.phone}
        onNewOrder={handleNewOrder}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <CheckoutHeader />
      <main className="grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
            <div>
              <h1 className="text-primary text-3xl md:text-4xl font-black mb-2">Finalizar Pedido</h1>
              <p className="text-text-secondary">Completa los datos para que tu pedido salga del horno cuanto antes.</p>
            </div>

            <div className="space-y-6">
              {/* Contact Info */}
              <section className="space-y-4">
                <h2 className="text-primary text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">contact_page</span>
                  Información de Contacto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Nombre completo (opcional)</label>
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
                    <label className="text-sm font-medium text-text-secondary">Correo electrónico</label>
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
                    <label className="text-sm font-medium text-text-secondary">Teléfono</label>
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

              {/* Pickup Info */}
              <section className="space-y-4">
                <h2 className="text-primary text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">storefront</span>
                  Detalles de Recogida
                </h2>
                <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                      <h3 className="text-primary font-bold">PUMAINCA RESTOBAR</h3>
                      <p className="text-sm text-text-secondary">Prolongacion Jaquijahuana, al frente de Astral GYM</p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <label className="text-xs text-text-secondary block mb-1">Hora estimada</label>
                    <select
                      value={pickupEstimate}
                      onChange={(e) => setPickupEstimate(e.target.value as "20m" | "45m" | "1h")}
                      className="w-full md:w-48 bg-black border border-zinc-800 text-white rounded-lg px-3 py-2 outline-none"
                    >
                      {pickupOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Special Instructions */}
              <section className="space-y-4">
                <label className="text-sm font-medium text-text-secondary">Instrucciones especiales (opcional)</label>
                <textarea
                  name="specialInstructions"
                  value={contactInfo.specialInstructions}
                  onChange={handleContactChange}
                  rows={3}
                  placeholder="Necesitas cubiertos, alergias o celebraciones"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
                />
              </section>

              {/* Payment Method */}
              <section className="space-y-4">
                <h2 className="text-primary text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">credit_card</span>
                  Método de Pago
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[{ id: "cash", label: "Pago en Local", icon: "payments" }].map((method) => (
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
                      <span className={`material-symbols-outlined text-3xl ${paymentMethod === method.id ? "text-primary" : "text-zinc-500"}`}>
                        {method.icon}
                      </span>
                      <span className={`font-bold text-sm ${paymentMethod === method.id ? "text-white" : "text-zinc-500"}`}>
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
              <OrderSummary
                cart={cart}
                totals={totals}
                error={orderError}
                isSubmitting={isSubmittingOrder}
                onSubmit={handleOrderSubmit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
