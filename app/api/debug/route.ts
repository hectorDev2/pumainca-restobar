import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured = !!supabaseUrl && !supabaseUrl.includes("placeholder") && !!supabaseKey && !supabaseKey.includes("placeholder");

  return NextResponse.json({
    status: isConfigured ? "✅ Configurado" : "❌ No Configurado",
    environment: process.env.NODE_ENV,
    credentials: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? `✅ Set (${supabaseUrl.substring(0, 30)}...)` : "❌ Missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey ? "✅ Set" : "❌ Missing",
    },
    timestamp: new Date().toISOString(),
    message: isConfigured ? "Supabase está correctamente configurado" : "⚠️ Supabase NO está configurado - revisar variables de entorno en Vercel"
  });
}
