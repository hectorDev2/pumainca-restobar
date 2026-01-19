import { createClient } from '@supabase/supabase-js'

// Leer variables de entorno de forma segura
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validar que las variables estén definidas (solo en servidor para evitar logs en cliente)
if (typeof window === 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials missing!')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `✅ Set (${supabaseUrl.substring(0, 30)}...)` : '❌ Missing')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
    console.error('Please ensure .env.local exists and contains these variables')
    console.error('Make sure Docker Compose is reading .env.local correctly')
  } else {
    console.log('✅ Supabase credentials loaded successfully')
  }
}

// Crear cliente con valores por defecto si no están disponibles (para evitar crashes)
// Nota: Las funciones de autenticación no funcionarán con valores placeholder
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'
)
