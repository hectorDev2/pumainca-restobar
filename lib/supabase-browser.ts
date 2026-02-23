import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

/**
 * Supabase client para uso en el navegador.
 * Usa @supabase/ssr para sincronizar la sesión en cookies,
 * lo que permite que el middleware de Next.js pueda leerla server-side.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
