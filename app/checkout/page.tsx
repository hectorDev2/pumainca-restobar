"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  ContactInfo,
  OrderItemPayload,
  OrderPayload,
  OrderConfirmation,
} from "@/types";
import { apiFetch } from "@/lib/api";
import type { OrderResponse } from "@/lib/api-types";
import {
  createInitialContactInfo,
  pickupEstimateLabels,
  getItemPrice,
} from "./utils";
import {
  CheckoutHeader,
  OrderConfirmationView,
  OrderSummary,
  ContactInfoSection,
  PickupInfoSection,
  SpecialInstructionsSection,
  PaymentMethodSection,
} from "./components";

export default function CheckoutPage() {
  const { cart, cartTotal: totals, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cash">("cash");
  const [contactInfo, setContactInfo] = useState<ContactInfo>(
    createInitialContactInfo,
  );
  const [pickupEstimate, setPickupEstimate] = useState<"20m" | "45m" | "1h">(
    "20m",
  );
  const [orderConfirmation, setOrderConfirmation] =
    useState<OrderConfirmation | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
      if (item.options?.cookingPoint)
        itemPayload.cooking_point = item.options.cookingPoint;
      if (item.options?.specialInstructions)
        itemPayload.special_instructions = item.options.specialInstructions;
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

    if (contactInfo.name.trim())
      payload.customer_name = contactInfo.name.trim();
    if (pickupEstimate) payload.pickup_time_estimate = pickupEstimate;
    if (contactInfo.specialInstructions.trim())
      payload.special_instructions = contactInfo.specialInstructions.trim();

    try {
      const data = await apiFetch<OrderResponse>("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setOrderConfirmation({
        number: data?.number ?? data?.orderNumber ?? data?.id?.toString(),
        message:
          data?.message ??
          "Tu pedido fue registrado y en breve te contactaremos.",
      });

      clearCart();
    } catch (error) {
      setOrderError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear el pedido.",
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
              <h1 className="text-primary text-3xl md:text-4xl font-black mb-2">
                Finalizar Pedido
              </h1>
              <p className="text-text-secondary">
                Completa los datos para que tu pedido salga del horno cuanto
                antes.
              </p>
            </div>

            <div className="space-y-6">
              <ContactInfoSection
                contactInfo={contactInfo}
                onChange={handleContactChange}
              />
              <PickupInfoSection
                pickupEstimate={pickupEstimate}
                onPickupChange={setPickupEstimate}
              />
              <SpecialInstructionsSection
                value={contactInfo.specialInstructions}
                onChange={handleContactChange}
              />
              <PaymentMethodSection
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />
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
