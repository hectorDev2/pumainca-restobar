# 📱 PWA (Progressive Web App) - Guía Completa

## ✅ Implementación Completada

La aplicación Pumainca Restobar ahora es una **Progressive Web App** completamente funcional.

---

## 🎯 Características Implementadas

### 1. **Instalación como App Nativa**
- ✅ Botón "Instalar" en navegador
- ✅ Icono en pantalla de inicio
- ✅ Ejecución sin barra de navegador (modo standalone)
- ✅ Splash screen con logo

### 2. **Funcionamiento Offline**
- ✅ Service Worker con estrategias de caché inteligentes
- ✅ Páginas visitadas disponibles sin conexión
- ✅ Página `/offline` cuando no hay conexión
- ✅ Detección automática de reconexión

### 3. **Experiencia Optimizada**
- ✅ Caché de imágenes (30 días)
- ✅ Caché de recursos estáticos (1 año)
- ✅ Caché de APIs (5 minutos)
- ✅ Precarga automática de recursos críticos

### 4. **Prompt de Instalación**
- ✅ Banner animado que invita a instalar
- ✅ Aparece después de 5 segundos
- ✅ Recuerda si el usuario rechazó
- ✅ No vuelve a aparecer si ya instaló

---

## 📋 Archivos Creados/Modificados

### Archivos Nuevos
```
public/
├── manifest.json          # Metadata de la PWA
├── sw.js                  # Service Worker manual
├── icons/                 # Iconos PWA (16 archivos)
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── icon-maskable-192x192.png
│   ├── icon-maskable-512x512.png
│   ├── apple-touch-icon.png
│   ├── shortcut-menu.png
│   ├── shortcut-reservation.png
│   └── shortcut-cart.png
├── favicon-16x16.png
└── favicon-32x32.png

app/
└── offline/
    └── page.tsx           # Página offline fallback

components/
├── InstallPWAPrompt.tsx   # Banner de instalación
└── PWARegister.tsx        # Registra service worker

scripts/
└── generate-pwa-icons.mjs # Script para generar iconos
```

### Archivos Modificados
```
app/layout.tsx             # Agregados meta tags PWA
next.config.mjs            # Restaurado (sin next-pwa)
package.json               # Script generate:pwa-icons
.gitignore                 # (limpiado)
```

---

## 🧪 Cómo Probar la PWA

### **Opción 1: Navegador Desktop (Chrome/Edge)**

1. **Iniciar servidor de producción:**
   ```bash
   npm run build
   npm start
   ```

2. **Abrir en Chrome:**
   ```
   http://localhost:3000
   ```

3. **Verificar PWA:**
   - Abrir DevTools (F12)
   - Ir a pestaña **Application**
   - En **Manifest**: Ver manifest.json cargado
   - En **Service Workers**: Ver sw.js activo
   - En **Storage > Cache Storage**: Ver cachés creados

4. **Instalar la app:**
   - Buscar icono ➕ en barra de direcciones
   - Clic en "Instalar Pumainca"
   - La app se abrirá en ventana separada

5. **Probar offline:**
   - Ir a DevTools > Network
   - Activar "Offline"
   - Navegar por páginas ya visitadas → ✅ Funcionan
   - Ir a página nueva → 🔌 Muestra `/offline`

---

### **Opción 2: Móvil (Recomendado)**

#### **Android - Chrome:**

1. **Conectar móvil a misma red WiFi que tu PC**

2. **Obtener IP local:**
   ```bash
   # Ya aparece en el output de npm start:
   # Network: http://192.168.1.7:3000
   ```

3. **Abrir en móvil:**
   ```
   http://[TU_IP]:3000
   ```

4. **Instalar:**
   - Aparecerá banner "Agregar a pantalla de inicio"
   - También en menú ⋮ > "Agregar a pantalla de inicio"

5. **Probar:**
   - Icono de Pumainca en pantalla de inicio
   - Abrir → Se ejecuta sin barra de Chrome
   - Activar modo avión → Páginas visitadas funcionan

#### **iOS - Safari:**

1. **Abrir en Safari:**
   ```
   http://[TU_IP]:3000
   ```

2. **Instalar:**
   - Tap en botón Compartir 📤
   - "Agregar a pantalla de inicio"
   - Editar nombre si deseas

3. **Limitaciones iOS:**
   - ⚠️ Service Workers tienen limitaciones en iOS
   - Offline funciona pero con menor caché
   - Instalar funciona perfectamente

---

## 🔍 Lighthouse Audit

### Verificar Score PWA

1. **Abrir DevTools**
2. **Pestaña Lighthouse**
3. **Seleccionar:**
   - ✅ Progressive Web App
   - ✅ Desktop/Mobile
4. **Generate Report**

**Resultado esperado:**
```
Progressive Web App: 90-100/100

✅ Installable
✅ Service Worker registered
✅ Manifest valid
✅ Icons present
✅ Offline capable
✅ Apple touch icon
```

---

## 🛠️ Mantenimiento

### Regenerar Iconos

Si cambias `public/logo.png`:

```bash
npm run generate:pwa-icons
```

Esto regenerará todos los iconos automáticamente.

---

### Actualizar Service Worker

Si modificas `public/sw.js`:

1. Hacer build nuevo:
   ```bash
   npm run build
   ```

2. Los usuarios verán prompt de actualización
3. Al aceptar, se recarga con nuevo service worker

---

### Cambiar Metadata PWA

Editar `public/manifest.json`:

```json
{
  "name": "Nuevo Nombre",
  "short_name": "NuevoNombre",
  "theme_color": "#nuevo-color"
}
```

---

## 📊 Estrategias de Caché Implementadas

### **Cache First** (Imágenes y Estáticos)
```
Usuario solicita imagen
   ↓
¿Está en caché? → Sí → Devolver de caché ⚡
   ↓ No
Descargar de red
   ↓
Guardar en caché
   ↓
Devolver al usuario
```

**Archivos:** `.png`, `.jpg`, `.webp`, `.svg`, `.css`, `.js`, `.woff`, `.ttf`
**Expiración:** 30 días (imágenes), 1 año (estáticos)

---

### **Network First** (HTML y APIs)
```
Usuario solicita API
   ↓
Intentar red (timeout 5s)
   ↓
¿Éxito? → Sí → Guardar en caché y devolver
   ↓ No
¿Está en caché? → Sí → Devolver de caché
   ↓ No
Error 503
```

**Archivos:** `/api/*`, páginas HTML
**Expiración:** 5 minutos (APIs), sin expiración (HTML)

---

## 🔐 Consideraciones de Seguridad

### ✅ Implementado
- HTTPS requerido en producción (Vercel lo hace automático)
- Service Worker solo en producción
- Scope limitado a `/`

### ⚠️ Notas
- En `localhost` funciona sin HTTPS (excepción de navegadores)
- En producción **DEBE** ser HTTPS
- Vercel/Netlify/etc proporcionan HTTPS gratis

---

## 📱 Shortcuts (Accesos Rápidos)

En Android/Windows, al hacer **clic derecho** en el icono de la app instalada:

```
📋 Ver Menú      → /menu
📅 Reservar Mesa → /reservas
🛒 Mi Carrito    → /cart
```

---

## 🐛 Troubleshooting

### **"Service Worker no se registra"**

**Solución:**
1. Verificar que estás en producción: `npm run build && npm start`
2. En desarrollo está **desactivado** (por diseño)
3. Abrir DevTools > Console > Ver mensajes de SW

---

### **"No aparece botón de instalar"**

**Causas posibles:**
1. Ya instalaste la app → Revisar Apps instaladas
2. Navegador no soporta PWA → Usar Chrome/Edge
3. Falta HTTPS (en producción) → Deployar en Vercel

---

### **"Offline no funciona"**

**Verificar:**
1. Service Worker activo: DevTools > Application > Service Workers
2. Cachés creadas: DevTools > Application > Cache Storage
3. Visitaste la página antes de ir offline

---

## 🚀 Deploy en Producción

### Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variables de entorno
# En dashboard de Vercel agregar:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

La PWA funcionará automáticamente con HTTPS de Vercel.

---

## 📈 Métricas de Éxito

### KPIs a monitorear:

- **Instalaciones:** Google Analytics - Event "app_installed"
- **Uso offline:** Service Worker analytics
- **Engagement:** Retención de usuarios con app instalada
- **Performance:** Lighthouse score > 90

---

## 🎓 Recursos Adicionales

### Documentación
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Next.js: PWA with Service Workers](https://nextjs.org/docs/app/building-your-application/optimizing/scripts#offloading-scripts-to-a-web-worker)

### Herramientas
- [PWA Builder](https://www.pwabuilder.com/) - Validar PWA
- [Manifest Generator](https://app-manifest.firebaseapp.com/)
- [Real Favicon Generator](https://realfavicongenerator.net/)

---

## ✅ Checklist Final

- [x] manifest.json creado y válido
- [x] Service Worker registrado
- [x] 16 iconos generados (72px - 512px)
- [x] Meta tags PWA en layout
- [x] Página offline implementada
- [x] Prompt de instalación funcional
- [x] Estrategias de caché configuradas
- [x] Build de producción exitoso
- [x] HTTPS en producción (al deployar)

---

## 🎉 ¡Listo!

Tu PWA está completamente funcional. Los usuarios ahora pueden:

✅ Instalar la app en su dispositivo
✅ Usarla sin conexión
✅ Disfrutar de carga ultra-rápida (caché)
✅ Acceder desde pantalla de inicio
✅ Experiencia nativa sin App Store

**Próximos pasos sugeridos:**
1. Deploy en Vercel/Netlify
2. Pruebas con usuarios reales
3. Implementar notificaciones push (opcional)
4. Analytics de PWA
