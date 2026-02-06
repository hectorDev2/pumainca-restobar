import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    environment: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurado" : "❌ Falta Configurar",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configurado" : "❌ Falta Configurar",
    },
    timestamp: new Date().toISOString()
  });
}
