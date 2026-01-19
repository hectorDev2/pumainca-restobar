#!/bin/bash
set -e

echo "🔍 Verificando variables de entorno..."

# Verificar variables críticas de Supabase
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "⚠️  ADVERTENCIA: NEXT_PUBLIC_SUPABASE_URL no está definida"
    echo "   Algunas funciones pueden no funcionar correctamente"
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  ADVERTENCIA: NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida"
    echo "   Algunas funciones pueden no funcionar correctamente"
fi

# Mostrar variables (solo primeros caracteres por seguridad)
if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "✅ NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:0:40}..."
fi

if [ -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:40}..."
fi

echo ""
echo "🚀 Iniciando aplicación Next.js..."
echo ""

# Ejecutar el comando original
exec "$@"
