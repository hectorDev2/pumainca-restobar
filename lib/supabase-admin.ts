import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const isProduction = process.env.NODE_ENV === "production";

if (!supabaseUrl) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseServiceRoleKey && isProduction) {
  console.error(
    "❌ Missing SUPABASE_SERVICE_ROLE_KEY in production. Server API routes may fail due to RLS.",
  );
}

if (!supabaseServiceRoleKey && !isProduction) {
  console.warn(
    "⚠️ SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY for local/dev.",
  );
}

const runtimeKey = supabaseServiceRoleKey || supabaseAnonKey;

export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  runtimeKey || "placeholder-service-role-key",
  {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  },
);
