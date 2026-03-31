
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { notFound, serverError } from "@/lib/utils/api-errors";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq(isNaN(Number(id)) ? "order_number" : "id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return notFound("Pedido no encontrado");
    }
    return serverError(error.message);
  }

  return NextResponse.json(data);
}
