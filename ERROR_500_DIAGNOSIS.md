# 🚨 Error 500 en Todas las APIs - Diagnóstico y Solución

## 📋 Problema Identificado

Todas las llamadas a la API devuelven **500 Internal Server Error** porque:

**❌ Las variables de entorno de Supabase NO están configuradas en Vercel**

Cuando las credenciales de Supabase faltan, todas las operaciones de base de datos fallan.

## ✅ Solución Inmediata

### Paso 1: Verifica que las variables estén en Vercel

1. Ve a **https://vercel.com**
2. Selecciona tu proyecto `pumainca-restobar`
3. Entra en **Settings → Environment Variables**
4. Revisa si existen estas variables:
   - `NEXT_PUBLIC_SUPABASE_URL` 
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Si **NO existen**, sigue el Paso 2.

### Paso 2: Agrega las Variables de Entorno

En el mismo lugar (Settings → Environment Variables):

**Agrega:**
```
NEXT_PUBLIC_SUPABASE_URL = [Tu Supabase Project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [Tu Supabase Anon Key]
```

**Cómo obtener estos valores:**
1. Ve a https://supabase.com
2. Abre tu proyecto
3. Settings → API
4. Copia:
   - **Project URL** (ej: `https://xyzabc.supabase.co`)
   - **anon public** (ej: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Paso 3: Redeploy

Después de agregar las variables:
- Vercel detectará el cambio automáticamente
- El app se redeployará
- **O** haz un `git push` para triggear un nuevo deploy

## 🔍 Verificar que Funciona

Después del redeploy, visita este endpoint:

```
https://pumainca-restobar.vercel.app/api/debug
```

**Resultado esperado:**
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

Si ves `❌ No Configurado`, revisa que:
- Las variables estén correctamente en Vercel
- No tengan espacios extra
- Los valores sean los reales (no placeholders)
- El deploy haya completado

## 🛠️ Cambios Implementados en Este Commit

Para facilitar el debugging futuro:

✅ **Mejorado error handling:**
- Todas las APIs ahora devuelven mensajes de error descriptivos
- Logs con contexto (qué endpoint, qué error, etc.)

✅ **Agregado endpoint `/api/debug`:**
- Detecta automáticamente si Supabase está configurado
- Muestra qué variables faltan
- Útil para debugging

✅ **Agregado soporte para `sort=recommended`:**
- `/api/products?sort=recommended` ahora funciona
- Ordena por `is_recommended` primero

✅ **Agregar documentación:**
- `VERCEL_ENV_SETUP.md` con instrucciones paso a paso

## 📝 Si Aún Tienes Problemas

1. **Revisa los logs de Vercel:**
   - Vercel Dashboard → Deployments → Click en el deployment
   - Ve la sección "Logs"
   - Busca mensajes de error

2. **Verifica la tabla existe en Supabase:**
   - https://supabase.com → tu proyecto
   - SQL Editor → Revisa que existan tablas: `products`, `orders`, `reservations`, `site_content`, etc.

3. **Prueba localmente:**
   ```bash
   npm run dev
   # Abre http://localhost:3000/api/debug
   # Si dice "✅ Configurado" en local pero no en Vercel,
   # el problema es que Vercel no tiene las variables
   ```

4. **Contacta al soporte de Vercel si:**
   - Agregaste las variables correctamente
   - El deploy completó
   - Pero aún recibés "❌ No Configurado"

---

**Última actualización:** 6 de febrero de 2026
**Estado:** 🔴 Crítico - Requiere configurar variables en Vercel
**Próximo paso:** Ir a Vercel y agregar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
