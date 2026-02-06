import { createClient } from '@supabase/supabase-js'

// Leer variables de entorno de forma segura
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validar que las variables estén definidas (solo en servidor para evitar logs en cliente)
if (typeof window === 'undefined') {
  const hasUrl = supabaseUrl && !supabaseUrl.includes('placeholder');
  const hasKey = supabaseAnonKey && !supabaseAnonKey.includes('placeholder');
  
  if (!hasUrl || !hasKey) {
    console.error('❌ SUPABASE CREDENTIALS MISSING!');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', hasUrl ? `✅ Set (${supabaseUrl.substring(0, 30)}...)` : '❌ Missing');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', hasKey ? '✅ Set' : '❌ Missing');
    console.error('');
    console.error('⚠️ ALL API CALLS WILL FAIL WITHOUT THESE CREDENTIALS');
    console.error('');
    console.error('📋 To fix:');
    console.error('1. Go to Vercel Dashboard → Settings → Environment Variables');
    console.error('2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('3. Redeploy the application');
    console.error('');
    console.error('📖 See VERCEL_ENV_SETUP.md for detailed instructions');
  } else {
    console.log('✅ Supabase credentials loaded successfully')
  }
}

// Crear cliente con valores reales o placeholder si no están disponibles
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'
)
