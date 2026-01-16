
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
      const body = await req.json();
      // body should contain 'status'
      
      const { data, error } = await supabase
        .from("orders")
        .update(body) // allow arbitrary updates or restrict to status?
        .eq(isNaN(Number(id)) ? "order_number" : "id", id) // support both lookup styles? Usually by ID here.
        // Queries.ts uses `updateOrderStatus(orderId)`. Ideally we should use the primary KEY 'id' (int8).
        // If frontend passes numeric ID string, it works.
        // Assuming params.id is the ID.
        .select()
        .single();
      
      if (error) throw error;
      
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
