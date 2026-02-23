
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { OrderStatus } from "@/types/domain";

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

const VALID_PAYMENT_STATUSES = ["pending", "completed", "failed"] as const;
type PaymentStatus = (typeof VALID_PAYMENT_STATUSES)[number];

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { status, payment_status } = body;

    if (status === undefined && payment_status === undefined) {
      return NextResponse.json(
        { error: "Se requiere al menos un campo: status o payment_status" },
        { status: 400 }
      );
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `status inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (
      payment_status !== undefined &&
      !VALID_PAYMENT_STATUSES.includes(payment_status)
    ) {
      return NextResponse.json(
        {
          error: `payment_status inválido. Valores permitidos: ${VALID_PAYMENT_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updatePayload: {
      status?: OrderStatus;
      payment_status?: PaymentStatus;
    } = {};
    if (status !== undefined) updatePayload.status = status;
    if (payment_status !== undefined) updatePayload.payment_status = payment_status;

    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq(isNaN(Number(id)) ? "order_number" : "id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Pedido no encontrado" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("orders")
    .select("status, payment_status")
    .eq(isNaN(Number(id)) ? "order_number" : "id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
