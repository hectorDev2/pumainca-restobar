#!/bin/bash
# Script para verificar que las variables de entorno estén configuradas

echo "🔍 Verificando variables de entorno..."

if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local no existe"
    echo "📝 Crea el archivo .env.local con las siguientes variables:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=tu_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=tu_service_key"
    exit 1
fi

# Cargar variables del archivo .env.local
set -a
source .env.local
set +a

# Verificar variables críticas
MISSING_VARS=()

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_SUPABASE_URL")
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_SUPABASE_ANON_KEY")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "❌ Variables faltantes en .env.local:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    exit 1
fi

echo "✅ Todas las variables de entorno están configuradas"
echo ""
echo "Variables encontradas:"
echo "  NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:0:30}..."
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:30}..."
