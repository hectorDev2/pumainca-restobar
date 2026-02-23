
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { badRequest, serverError } from "@/lib/utils/api-errors";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  let query = supabase.from("reservations").select("*");

  if (email) {
    query = query.eq("email", email);
  }

  const { data, error } = await query.order("reservation_date", { ascending: false });

  if (error) {
    return serverError(error.message);
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.email || (!body.phone_number && !body.phoneNumber)) {
      return badRequest("Email y teléfono son requeridos");
    }
    
    // Generate code
    const code = `RES${new Date().toISOString().slice(0,10).replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
    
    const { data, error } = await supabase
      .from("reservations")
      .insert({
        reservation_code: code,
        full_name: body.fullName ?? body.full_name,
        email: body.email,
        phone_number: body.phoneNumber ?? body.phone_number,
        reservation_date: body.reservationDate ?? body.reservation_date,
        reservation_time: body.reservationTime ?? body.reservation_time,
        number_of_guests: body.numberOfGuests ?? body.number_of_guests,
        special_requests: body.specialRequests ?? body.special_requests,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/reservations] Supabase insert error:", error);
      throw new Error(error.message || "Error al crear reserva");
    }

    return NextResponse.json({
        ...data,
        message: "Reserva creada exitosamente"
    });
  } catch (err: any) {
    console.error("[POST /api/reservations] Unexpected error:", err);
    return serverError(err?.message || "Error interno del servidor");
  }
}
