
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const paymentStatus = searchParams.get("paymentStatus");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*, items:order_items(*)", { count: "exact" });

  if (status) query = query.eq("status", status);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);

  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    meta: {
        total: count,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, ...orderData } = body;
    
    if (!body.customer_email || !body.customer_phone) {
      return NextResponse.json(
        { error: "Email y teléfono son requeridos" },
        { status: 400 }
      );
    }
    
    // Generate Order Number
    const orderNumber = `PED${new Date().toISOString().slice(0,10).replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Insert Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        ...orderData,
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending' // default
      })
      .select()
      .single();

    if (orderError) {
      console.error("[POST /api/orders] Supabase order insert error:", orderError);
      throw new Error(orderError.message || "Error al crear pedido");
    }

    // Insert Items
    if (items && items.length > 0) {
        const itemsWithId = items.map((item: any) => ({
            ...item,
            order_id: order.id
        }));
        
        const { error: itemsError } = await supabase.from("order_items").insert(itemsWithId);
        if (itemsError) {
             console.error("[POST /api/orders] Supabase items insert error:", itemsError);
             // Rollback sort of
             await supabase.from("orders").delete().eq("id", order.id);
             throw new Error(itemsError.message || "Error al insertar items");
        }
    }

    return NextResponse.json({
        ...order,
        items,
        message: "Pedido creado exitosamente"
    });

  } catch (err: any) {
    console.error("[POST /api/orders] Unexpected error:", err);
    return NextResponse.json(
      { error: err?.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
