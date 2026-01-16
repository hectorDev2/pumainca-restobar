
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try to find by ID (if numeric) or Order Number (string)
  // Since ID is numeric (INT8) in DB, checking if 'id' param is purely numeric might help, 
  // but order number 'PED...' is string.
  // We can search by order_number first, if fail, try id if numeric.
  
  let query = supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("order_number", id)
    .single();

  let { data, error } = await query;

  if (!data && !isNaN(Number(id))) {
     const { data: byId, error: errById } = await supabase
       .from("orders")
       .select("*, items:order_items(*)")
       .eq("id", id)
       .single();
     data = byId;
     error = errById;
  }

  if (error || !data) {
    return NextResponse.json(
      { message: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
