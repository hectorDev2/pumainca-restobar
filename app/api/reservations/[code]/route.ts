
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { badRequest, notFound, serverError } from "@/lib/utils/api-errors";

const ALLOWED_UPDATE_FIELDS = [
  "status",
  "full_name",
  "email",
  "phone_number",
  "reservation_date",
  "reservation_time",
  "number_of_guests",
  "special_requests",
] as const;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("reservation_code", code)
    .single();

  if (error || !data) {
    return notFound("Reserva no encontrada");
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("JSON inválido en el cuerpo de la solicitud");
  }

  // Solo permitir campos conocidos
  const updates: Record<string, unknown> = {};
  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return badRequest(
      `No se proporcionaron campos válidos. Campos permitidos: ${ALLOWED_UPDATE_FIELDS.join(", ")}`
    );
  }

  try {
    const { data, error } = await supabase
      .from("reservations")
      .update(updates)
      .eq("reservation_code", code)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return notFound("Reserva no encontrada");
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return serverError(err.message);
  }
}
