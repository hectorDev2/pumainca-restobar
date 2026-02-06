# 🔧 Configurar Variables de Entorno en Vercel

## ⚠️ Problema Actual
Todas las APIs devuelven 500 porque **las variables de entorno de Supabase no están configuradas en Vercel**.

## ✅ Solución

### Paso 1: Ir a Vercel Dashboard
1. Ve a https://vercel.com
2. Selecciona tu proyecto `pumainca-restobar`
3. Entra en **Settings → Environment Variables**

### Paso 2: Agregar Variables
Agrega estas dos variables (obtén los valores de tu Supabase Project):

```
NEXT_PUBLIC_SUPABASE_URL = https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**¿Cómo obtener estos valores?**
1. Ve a https://supabase.com
2. Abre tu proyecto
3. Settings → API
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Paso 3: Redeploy
Después de agregar las variables:
1. En Vercel, ve a **Deployments**
2. Haz clic en los 3 puntos del último deployment
3. Selecciona **Redeploy**

O simplemente haz un push a tu rama principal:
```bash
git push origin main
```

## 🔍 Verificar que Funciona
Después del redeploy, visita:
```
https://tu-dominio.vercel.app/api/debug
```

Deberías ver:
```json
{
  "status": "✅ Configurado",
  "credentials": {
    "NEXT_PUBLIC_SUPABASE_URL": "✅ Set (https://...)",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "✅ Set"
  },
  "message": "Supabase está correctamente configurado"
}
```

Si ves "❌ No Configurado", revisa que las variables estén correctamente en Vercel.

## 📋 Variables de Entorno Completas

Si quieres agregar más variables (opcionales pero recomendadas):

```
# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...

# ImageKit (OPCIONAL - para upload de imágenes)
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT = https://ik.imagekit.io/xxx/
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY = public_xxx
IMAGEKIT_PRIVATE_KEY = private_xxx

# API Base (OPCIONAL - si usas backend separado)
NEXT_PUBLIC_API_BASE_URL = https://tu-backend.com
```

## 🚨 Si Aún Tienes Errores 500

Verifica que:
1. ✅ Las variables están en Vercel (Settings → Environment Variables)
2. ✅ El proyecto se redeployó después de agregar las variables
3. ✅ Los valores están correctos (sin espacios extra, sin comillas)
4. ✅ Las tablas existen en Supabase: `products`, `orders`, `reservations`, `site_content`, etc.

Si todo está correcto pero aún hay errores, revisa los logs de Vercel:
- En Vercel Dashboard → Deployments → Logs
- O ejecuta localmente: `npm run dev` y revisa la consola
