
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> } // folder is [code]
) {
  const { code } = await params;

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("reservation_code", code)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { message: "Reserva no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
