<div align="center">
<img width="300" src="https://ik.imagekit.io/pumainca/public/cover.jpeg?updatedAt=1768571680905" alt="Pumainca Restobar Logo" />
<h1>Pumainca Restobar</h1>
<p><strong>Sistema de Gestión Digital para Restaurante</strong></p>
<p>Plataforma web moderna para digitalizar y optimizar la experiencia gastronómica</p>
</div>

---

## 📋 Descripción

**Pumainca Restobar** es una plataforma web completa diseñada para digitalizar y optimizar la experiencia gastronómica tanto para clientes como para el equipo administrativo del restaurante. El sistema permite a los clientes explorar el menú digital, realizar pedidos para recoger, y reservar mesas en línea, mientras que el personal administrativo puede gestionar pedidos, reservas, inventario y contenido del sitio web en tiempo real.

### Problema que Resuelve
- **Clientes:** Dificultad para ver el menú actualizado, realizar pedidos sin llamadas telefónicas, y reservar mesas de forma rápida.
- **Administración:** Gestión manual de pedidos y reservas, falta de visibilidad en tiempo real, actualizaciones lentas del menú.

### Solución Propuesta
Una aplicación web progresiva (PWA) con:
- Menú digital interactivo con carrito de compras
- Sistema de pedidos en línea para recoger
- Sistema de reservas con confirmación automática
- Panel de administración completo para gestión operativa

---

## 🚀 Stack Tecnológico

### Frontend
- **Framework:** [Next.js 16.1.1](https://nextjs.org/) (App Router)
- **Librería UI:** [React 19.2.3](https://react.dev/)
- **Lenguaje:** [TypeScript 5.8](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) con diseño responsivo y personalizado
- **Animaciones:** 
  - [Framer Motion 12.23.26](https://www.framer.com/motion/)
  - [Motion 12.27.5](https://motion.dev/)
- **Componentes UI:** 
  - [Lucide React 0.562.0](https://lucide.dev/) (Iconos)
  - [Tabler Icons 3.36.1](https://tabler.io/icons)
- **Formularios:** [React DatePicker 9.1.0](https://reactdatepicker.com/)
- **Utilidades:** 
  - [clsx 2.1.1](https://github.com/lukeed/clsx) - Composición de clases
  - [tailwind-merge 3.4.0](https://github.com/dcastil/tailwind-merge) - Merge de clases Tailwind

### Backend/Database
- **BaaS:** [Supabase 2.90.1](https://supabase.com/)
  - PostgreSQL (Base de datos relacional)
  - Auth (Autenticación con JWT)
  - Storage (Almacenamiento de archivos e imágenes)
  - Real-time subscriptions
- **Data Fetching & Caching:** [TanStack Query v5.90.16](https://tanstack.com/query)
  - React Query DevTools v5.91.2 incluido

### Servicios Externos
- **CDN de Imágenes:** [ImageKit.io 6.0.0](https://imagekit.io/)
  - ImageKit React SDK 4.3.0
  - Optimización automática de imágenes
  - Transformación en tiempo real
- **Optimización de Imágenes:** [Sharp 0.34.5](https://sharp.pixelplumbing.com/)
- **Hosting:** Vercel (recomendado) / Docker compatible

### DevOps & Testing
- **Containerización:** Docker + Docker Compose
- **Control de Versiones:** Git
- **Package Manager:** npm / bun
- **Build Tool:** Next.js (Turbopack)
- **Testing:** [Playwright](https://playwright.dev/) con Python (E2E tests)
- **Runtime:** Node.js >= 20.0.0
- **Utilidades:** 
  - [tsx 4.21.0](https://github.com/esbuild-kit/tsx) - TypeScript ejecutable
  - [dotenv 17.2.3](https://github.com/motdotla/dotenv) - Variables de entorno

---

## ✨ Características Principales

### 🛒 Experiencia del Cliente (Frontend Público)

#### Página de Inicio
- Hero section con imagen de fondo atractiva
- Call-to-actions principales (Ver Menú, Reservar Mesa)
- Secciones de Historia y Filosofía del restaurante
- Contenido editable desde panel admin
- Diseño responsive y animaciones suaves
- Footer con información de contacto y redes sociales

#### Menú Digital
- Filtrado por categorías (Entradas, Platos de Fondo, Bebidas, Postres, etc.)
- Búsqueda por nombre de plato en tiempo real
- Vista de grid con imágenes de alta calidad
- Información detallada de cada producto:
  - Descripción completa
  - Precio (con IGV incluido)
  - Ingredientes y alérgenos
  - Indicadores (Vegetariano, Picante, Sin Gluten, Especial del Chef)
  - Tiempo de preparación
  - Galería de imágenes

#### Carrito de Compras
- Gestión de items, cantidad y subtotales
- **Precios con IGV Incluido**: Cálculo transparente para el cliente
- Sin tarifas de servicio ocultas
- Persistencia del carrito entre sesiones
- Cálculo automático de subtotales e impuestos

#### Checkout
- Formulario de contacto completo
- Validación de email y teléfono
- Selector de tiempo estimado de recogida
- Confirmación de pedidos con número único de seguimiento
- Validación de campos requeridos

#### Reservas
- Formulario para reservar mesa (Fecha, Hora, Número de Personas)
- Validación de datos y disponibilidad
- Confirmación inmediata con código único
- Búsqueda de reservas por código o email

### 🛡️ Panel de Administración (`/admin`)

Acceso protegido mediante autenticación con Supabase Auth.

#### Dashboard
- Vista general del sistema
- Métricas clave de operaciones
- Acceso rápido a funciones principales

#### Gestión de Productos (`/admin`)
- **CRUD Completo**: Crear, leer, actualizar y eliminar productos
- Subida de imágenes con preview
- Gestión de categorías y subcategorías
- Control de precios variables
- Flags booleanos (Disponible, Chef Special, Recomendado, Vegetariano, etc.)
- Gestión de ingredientes y alérgenos
- Galería de imágenes por producto

#### Gestión de Pedidos (`/admin/orders`)
- Tabla detallada con estado de pago, cliente y total
- **Actualización de Estado**: Cambia entre *Pendiente, Confirmado, Completado, Cancelado* directamente desde la tabla
- Filtros por estado y fecha
- **Vista Detallada**: Modal con lista de items, precios unitarios y notas especiales
- Búsqueda por número de pedido o cliente

#### Gestión de Reservas (`/admin/reservations`)
- Historial completo de reservas
- Filtros por Email o Código de Reserva
- **Gestión de Estado**: Aprueba o cancela reservas con un clic
- Vista detallada de cada reserva
- Búsqueda avanzada

#### Gestión de Contenido (`/admin/content`)
- Edita los textos principales de la página de inicio
- Actualización en tiempo real
- Control de hero section, historia y filosofía

#### Gestión de Categorías
- Crear y editar categorías
- Asignar subcategorías
- Prevenir eliminación de categorías con productos asociados

#### Configuración (`/admin/settings`)
- Gestión de cuenta de administrador (Email/Password)
- Configuración de notificaciones (futuro)
- Configuración de horarios de operación (futuro)

### 📱 Progressive Web App (PWA)

Pumainca Restobar es una **Progressive Web App** completamente funcional que permite a los usuarios:

#### Características PWA Implementadas
- ✅ **Instalable:** Los usuarios pueden instalar la app directamente desde el navegador
  - Banner automático de instalación (después de 5 segundos)
  - Acceso desde icono en pantalla de inicio
  - Experiencia de app nativa (sin barra de navegador)

- ✅ **Funciona Offline:** Service Worker con caché inteligente
  - Páginas visitadas disponibles sin conexión
  - Caché de imágenes (30 días)
  - Caché de recursos estáticos (1 año)
  - Caché de APIs (5 minutos con Network First)
  - Página fallback amigable cuando no hay conexión

- ✅ **Optimizado:** Estrategias de caché avanzadas
  - **Cache First:** Imágenes y recursos estáticos
  - **Network First:** HTML y APIs (con fallback a caché)
  - Precarga automática de recursos críticos

- ✅ **Responsive:** Optimizado para todos los dispositivos
  - Manifest con múltiples tamaños de iconos (72px - 512px)
  - Iconos maskable para Android adaptive icons
  - Apple Touch Icon para iOS
  - Shortcuts personalizados (Menú, Reservas, Carrito)

- ✅ **SEO & Compartible:** Meta tags para redes sociales
  - Open Graph tags para Facebook/LinkedIn
  - Twitter Card support
  - Manifest linked
  - Theme color configurable

**Para más detalles:** Ver [PWA_GUIDE.md](./PWA_GUIDE.md)

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
- **Node.js** >= 20.0.0
- **npm** o **bun** (recomendado)
- Cuenta de **Supabase** (gratis)
- Cuenta de **ImageKit.io** (opcional, para CDN de imágenes)

### Opción 1: Instalación Local (Sin Docker)

#### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd pumainca-restobar
```

#### 2. Instalar dependencias
```bash
# Con npm
npm install

# O con bun (más rápido)
bun install
```

#### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ImageKit Configuration (Opcional - para CDN de imágenes)
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_FOLDER=/pumainca

# API Configuration (Opcional)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

**Variables REQUERIDAS:**
- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave anónima de Supabase

**Variables OPCIONALES:**
- Variables de ImageKit (si deseas usar CDN externo)
- `NEXT_PUBLIC_API_BASE_URL` (por defecto usa rutas relativas)

#### 4. Configurar Base de Datos en Supabase

Ejecuta las migraciones SQL en tu proyecto Supabase:

1. Ve a tu dashboard de Supabase → SQL Editor
2. Ejecuta los scripts en la carpeta `migrations/`
3. O consulta [ESTRUCTURA_BASE_DATOS.md](./ESTRUCTURA_BASE_DATOS.md) para el esquema completo

Tablas principales:
- `products` - Productos del menú
- `categories` - Categorías de productos
- `orders` - Pedidos de clientes
- `order_items` - Detalles de pedidos
- `reservations` - Reservas de mesa
- `site_content` - Contenido editable del sitio

#### 5. Ejecutar en modo desarrollo
```bash
# Con npm
npm run dev

# Con bun
bun dev
```

La aplicación estará disponible en `http://localhost:3000`

#### 6. Acceder al panel de administración
- Navega a `/login` o `/admin`
- Crea un usuario administrador desde Supabase Auth
- Inicia sesión con tus credenciales

#### 7. Build para producción
```bash
# Construir
npm run build

# Ejecutar en producción
npm start
```

Ver [DOCKER.md](./DOCKER.md) para instrucciones de Docker

### Solución de Problemas Comunes

#### Error: "Supabase URL is required"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` esté en `.env.local`
- Reinicia el servidor de desarrollo

#### Error de autenticación
- Verifica que `NEXT_PUBLIC_SUPABASE_ANON_KEY` sea correcta
- Asegúrate de tener un usuario creado en Supabase Auth

#### Imágenes no cargan
- Si usas ImageKit, verifica las credenciales
- Las imágenes también funcionan sin ImageKit usando Supabase Storage

#### Puerto 3000 ocupado
```bash
# Cambiar puerto en package.json
"dev": "next dev -p 3001"
```



---

## 🧪 Testing

El proyecto incluye una suite completa de tests end-to-end (E2E) con **Playwright** y **Python**, cubriendo todos los casos de uso críticos del sistema.

### Suite de Tests (18 casos de prueba)

#### Tests Funcionales del Cliente
- **TC001**: Homepage Load Performance and UI Rendering
- **TC002**: Menu Filtering and Search Functionality  
- **TC003**: Detailed Product View Display
- **TC004**: Shopping Cart Quantity Management and Persistence
- **TC005**: Checkout Form Validation and Submission
- **TC006**: Order Confirmation Email Delivery
- **TC007**: Reservation Form Validation and Confirmation
- **TC008**: Reservation Confirmation Email Delivery

#### Tests del Panel de Administración
- **TC009**: Admin Authentication and Route Protection
- **TC010**: Product CRUD Operations with Image Upload and Validation
- **TC011**: Category Management CRUD and Prevent Deletion of Referenced Categories
- **TC012**: Orders Management - Status Update, Filtering and Cancellation
- **TC013**: Reservations Management - Search, Validation and Confirmation
- **TC018**: Admin Dashboard Accessibility and Navigation

#### Tests de API y Sistema
- **TC014**: API Endpoint HTTP Status Codes and Error Handling
- **TC015**: Real-Time UI Updates with React Query for Orders and Reservations
- **TC016**: Shopping Cart Correct Subtotal and Tax (IGV) Calculation
- **TC017**: Checkout Pickup Time Validation

### Ejecutar Tests

```bash
# Requisitos previos
pip install playwright
playwright install

# Ejecutar un test individual
python tests/TC001_Homepage_Load_Performance_and_UI_Rendering.py

# Ejecutar todos los tests (requiere TestSprite configurado)
# Ver testsprite_frontend_test_plan.json
```

### Cobertura de Tests
- ✅ Funcionalidad del cliente (menú, carrito, checkout)
- ✅ Sistema de reservas completo
- ✅ Panel de administración (CRUD completo)
- ✅ Autenticación y protección de rutas
- ✅ Validación de formularios
- ✅ Integración con APIs
- ✅ Cálculos de precios e impuestos
- ✅ Actualizaciones en tiempo real (React Query)

---

## � Scripts Disponibles

### Desarrollo
```bash
npm run dev              # Inicia servidor de desarrollo (puerto 3000)
npm run start:dev        # Alias de npm run dev
npm run build            # Construye la aplicación para producción
npm run start            # Inicia servidor de producción
npm run lint             # Ejecuta ESLint
```

### Docker - Desarrollo
```bash
npm run docker:dev           # Inicia entorno de desarrollo con hot reload
npm run docker:dev:build     # Reconstruye las imágenes de desarrollo
npm run docker:dev:down      # Detiene y elimina contenedores de desarrollo
npm run docker:dev:logs      # Muestra logs en tiempo real (desarrollo)
```

### Docker - Producción
```bash
npm run docker:build         # Construye imagen Docker de producción
npm run docker:prod          # Inicia servicios en modo producción
npm run docker:prod:build    # Reconstruye imágenes de producción
npm run docker:prod:down     # Detiene servicios de producción
npm run docker:prod:logs     # Muestra logs de producción
```

### Utilidades
```bash
npm run docker:check-env     # Verifica variables de entorno
npm run generate:pwa-icons   # Regenera iconos PWA desde logo.png
```

**Nota:** Los scripts de Docker usan `scripts/docker-compose-wrapper.sh` que detecta automáticamente si el sistema usa `docker compose` (moderno) o `docker-compose` (legacy) para máxima compatibilidad.

---

## 🎯 Métricas de Rendimiento

| Métrica | Objetivo | Estado |
|---------|----------|--------|
| Tiempo de carga inicial | < 2s | ✅ Optimizado |
| First Contentful Paint (FCP) | < 1.5s | ✅ Optimizado |
| Largest Contentful Paint (LCP) | < 2.5s | ✅ Optimizado |
| Time to Interactive (TTI) | < 3.5s | ✅ Optimizado |
| Cumulative Layout Shift (CLS) | < 0.1 | ✅ Optimizado |
| First Input Delay (FID) | < 100ms | ✅ Optimizado |
| Lighthouse Performance Score | > 90 | 🟡 En monitoreo |
| Core Web Vitals | Aprobado | 🟡 En monitoreo |

### Optimizaciones Implementadas

#### Imágenes
- ✅ Next.js Image Component con lazy loading
- ✅ ImageKit CDN para transformación dinámica
- ✅ Formatos modernos (WebP, AVIF)
- ✅ Sharp para optimización local
- ✅ Responsive images con srcset

#### Código
- ✅ Code splitting automático (Next.js)
- ✅ Tree shaking y minificación
- ✅ Server Components por defecto
- ✅ Dynamic imports para componentes pesados
- ✅ React Suspense boundaries

#### Datos
- ✅ React Query para caching inteligente
- ✅ Prefetching de datos críticos
- ✅ Stale-while-revalidate strategy
- ✅ Optimistic updates

#### Estilos
- ✅ Tailwind CSS (PostCSS optimizado)
- ✅ CSS Modules cuando necesario
- ✅ Purge de CSS no utilizado
- ✅ Inline critical CSS

---

## 📱 Responsive & PWA

- ✅ Mobile-first design con Tailwind CSS
- ✅ Completamente responsive (mobile a desktop)
- ✅ Progressive Web App (PWA) - instalable como app nativa
- ✅ Service Worker con caché inteligente
- ✅ Funciona offline
- ✅ Accesible (WCAG 2.1)

**Ver detalles:** [PWA_GUIDE.md](./PWA_GUIDE.md)

---

## 🔐 Seguridad y Autenticación

### Sistema de Autenticación
- **Provider:** Supabase Auth con JWT tokens
- **Método:** Email/Password (extensible a OAuth)
- **Sesión:** Persistente con refresh tokens automáticos
- **Expiración:** Configurable desde Supabase dashboard

### Protección de Rutas
```typescript
// Componente ProtectedRoute
// Verifica autenticación antes de renderizar
<ProtectedRoute>
  <AdminPanel />
</ProtectedRoute>
```

### Middleware de Seguridad
- ✅ Validación de tokens JWT en cada request
- ✅ Rate limiting (configurado en Supabase)
- ✅ CORS configurado para dominios permitidos
- ✅ Sanitización de inputs del usuario
- ✅ Protección contra SQL Injection (Supabase)
- ✅ Protección CSRF en formularios
- ✅ Headers de seguridad (next.config.mjs)

### Row Level Security (RLS)
Supabase implementa RLS en todas las tablas:
```sql
-- Ejemplo: Solo admins pueden modificar productos
CREATE POLICY "Only authenticated users can modify products"
ON products
USING (auth.role() = 'authenticated');
```

### Gestión de Roles y Permisos
- **Admin:** Acceso completo al panel de administración
- **Cliente:** Solo visualización de menú público
- **Guest:** Visualización limitada

### Variables de Entorno Seguras
```env
# ❌ NO COMMITEAR archivos .env con credenciales
# ✅ Usar .env.local (gitignored)
# ✅ Configurar en plataforma de deploy
```

### Recomendaciones de Seguridad
1. **Cambiar credenciales por defecto** en producción
2. **Habilitar 2FA** para cuentas de administrador
3. **Rotar tokens** periódicamente
4. **Monitorear logs** de acceso sospechoso
5. **Mantener dependencias actualizadas** (`npm audit`)
6. **Configurar backups** automáticos en Supabase
7. **Usar HTTPS** obligatorio en producción

---

## 📊 Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Páginas    │  │ Componentes  │  │   Context    │     │
│  │   Públicas   │  │      UI      │  │ (Auth, Cart) │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                     ┌──────▼──────┐                         │
│                     │ React Query │                         │
│                     │ (TanStack)  │                         │
│                     │ Data Cache  │                         │
│                     └──────┬──────┘                         │
└────────────────────────────┼──────────────────────────────┘
                             │ HTTP/REST
                             │
┌────────────────────────────▼──────────────────────────────┐
│             SERVIDOR (Next.js App Router)                  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │           Server Components (RSC)                    │ │
│  │  - Renderizado en servidor                           │ │
│  │  - Mejor SEO                                         │ │
│  │  - Menor bundle de JavaScript                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                             │                              │
│  ┌──────────────────────────▼────────────────────────┐   │
│  │              API Routes (/app/api/*)               │   │
│  │  /products │ /orders │ /reservations │ /upload    │   │
│  └──────────────────────────┬────────────────────────┘   │
└─────────────────────────────┼──────────────────────────────┘
                              │ Supabase SDK
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                      SUPABASE BaaS                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  PostgreSQL  │  │   Supabase   │  │   Supabase   │    │
│  │   Database   │  │     Auth     │  │   Storage    │    │
│  │              │  │  (JWT/OAuth) │  │   (Files)    │    │
│  │ - products   │  │              │  │              │    │
│  │ - orders     │  │ - users      │  │ - images     │    │
│  │ - categories │  │ - sessions   │  │ - uploads    │    │
│  │ - reservas   │  │              │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         Row Level Security (RLS) Policies           │  │
│  │  - Protección a nivel de fila                       │  │
│  │  - Permisos granulares por usuario                  │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                  SERVICIOS EXTERNOS                        │
│  ┌──────────────────┐           ┌──────────────────┐      │
│  │   ImageKit CDN   │           │   Vercel Edge    │      │
│  │                  │           │     Network      │      │
│  │ - Image Optimize │           │ - Global CDN     │      │
│  │ - Transformations│           │ - Edge Functions │      │
│  │ - Lazy Loading   │           │                  │      │
│  └──────────────────┘           └──────────────────┘      │
└────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

#### 1. Lectura de Datos (Cliente → Servidor → DB)
```
User Action → React Component → React Query Hook 
→ API Route → Supabase Client → PostgreSQL
→ Return Data → Cache → UI Update
```

#### 2. Escritura de Datos (Mutaciones)
```
Form Submit → Validation → API Route
→ Supabase Insert/Update → DB Write
→ React Query Invalidation → Refetch → UI Update
```

#### 3. Autenticación
```
Login Form → Supabase Auth API → JWT Token
→ Store in Context → Protected Route Check
→ Include in API Requests → Verify on Server
```

### Características Arquitectónicas

#### Server-Side Rendering (SSR)
- ✅ Páginas críticas renderizadas en servidor
- ✅ Mejor SEO para contenido público
- ✅ First Contentful Paint optimizado

#### Static Site Generation (SSG)
- ✅ Páginas estáticas pre-renderizadas
- ✅ Build time optimization
- ✅ Revalidación incremental (ISR)

#### Client-Side Rendering (CSR)
- ✅ Componentes interactivos
- ✅ Actualizaciones en tiempo real
- ✅ Rich user experiences

#### Edge Computing
- ✅ Middleware ejecutado en edge
- ✅ Baja latencia global
- ✅ Geo-routing automático

---


### Configuración de Supabase

#### 1. Crear Proyecto
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Guarda las credenciales (URL y Anon Key)

#### 2. Configurar Tablas
Ejecuta los scripts SQL en `migrations/`:
```sql
-- Ver ESTRUCTURA_BASE_DATOS.md para esquema completo
```

#### 3. Configurar Storage
1. Ve a Storage → Create Bucket
2. Crea bucket `products` para imágenes
3. Configura políticas de acceso público

#### 4. Configurar Auth
1. Ve a Authentication → Providers
2. Habilita Email/Password
3. (Opcional) Configura OAuth providers (Google, GitHub)

### Configuración de ImageKit

1. Crea cuenta en [ImageKit.io](https://imagekit.io)
2. Ve a Developer Options
3. Copia tus credenciales (URL Endpoint, Public Key, Private Key)
4. Configura transformaciones por defecto (opcional)

---

## 🚧 Roadmap y Mejoras Futuras

### En Desarrollo
- [ ] Sistema de notificaciones push
- [ ] Panel de analytics y reportes
- [ ] Modo oscuro / claro
- [ ] Multi-idioma (i18n)

### Planeado
- [ ] App móvil nativa (React Native)
- [ ] Sistema de delivery (integración con mapas)
- [ ] Programa de fidelización y puntos
- [ ] Integración con POS (Point of Sale)
- [ ] Sistema de inventario avanzado
- [ ] Reportes y analytics avanzados
- [ ] Chatbot con IA para recomendaciones
- [ ] Integración con redes sociales

### Mejoras Técnicas
- [ ] Migrar a React Server Components 100%
- [ ] Implementar PWA completo
- [ ] Añadir tests unitarios (Jest/Vitest)
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo con Sentry
- [ ] Logs con Winston/Pino

---

## ❓ FAQ (Preguntas Frecuentes)

### ¿Necesito una cuenta de pago en Supabase?
No, el tier gratuito de Supabase es suficiente para empezar. Incluye:
- 500 MB de almacenamiento de base de datos
- 1 GB de almacenamiento de archivos
- 50,000 usuarios activos mensuales

### ¿Es obligatorio usar ImageKit?
No, es opcional. El sistema funciona sin ImageKit usando Supabase Storage. ImageKit proporciona optimización adicional y transformaciones en tiempo real.

### ¿Puedo usar otro servicio de autenticación?
Sí, aunque Supabase Auth está integrado, puedes reemplazarlo con Auth0, Firebase Auth, NextAuth.js, etc. Requiere modificar `AuthContext.tsx` y los endpoints relacionados.

### ¿Cómo agrego más administradores?
1. Ve a tu Supabase Dashboard → Authentication
2. Crea usuarios manualmente o desde la app
3. Los usuarios creados pueden acceder a `/login`

### ¿Soporta múltiples restaurantes?
No en la versión actual. Es un sistema single-tenant. Para multi-tenant requiere:
- Agregar tabla `restaurants`
- Modificar RLS policies
- Adaptar el schema de base de datos

### ¿Cómo personalizo los colores y estilos?
Edita `tailwind.config.ts`:
```typescript
colors: {
  primary: '#tu-color',
  secondary: '#tu-color',
  // ...
}
```

### ¿Funciona offline?
Parcialmente. React Query mantiene cache, pero requiere conexión para:
- Crear pedidos/reservas
- Cargar nuevos datos
- Autenticación

### ¿Puedo integrarlo con mi sistema existente?
Sí, vía las API Routes en `/app/api/*`. Son endpoints REST estándar que pueden consumirse desde cualquier cliente.

---

## 🤝 Contribución

Este es un proyecto privado para **Pumainca Restobar**. 

### Para Contribuir:
1. Contacta al equipo de desarrollo
2. Solicita acceso al repositorio
3. Lee las guías de estilo y convenciones
4. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
5. Haz commits descriptivos: `git commit -m "feat: descripción del cambio"`
6. Push a tu rama: `git push origin feature/nueva-funcionalidad`
7. Abre un Pull Request

### Convenciones de Commits
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan el código)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

---

## 📄 Licencia

© 2025 **Pumainca Restobar**. Todos los derechos reservados.

Este proyecto es propiedad privada de Pumainca Restobar. El código fuente, diseño, assets y toda la propiedad intelectual contenida en este repositorio están protegidos por derechos de autor.

**No se permite:**
- Uso comercial sin autorización
- Redistribución del código
- Modificación sin permiso
- Uso de marca y assets

Para consultas sobre licenciamiento, contacta a: [email de contacto]

---

## 📞 Soporte y Contacto

### Soporte Técnico
- **Email:** [soporte@pumainca.com]
- **Teléfono:** [número de contacto]
- **Horario:** Lunes a Viernes, 9:00 - 18:00 (hora local)

### Reportar Problemas
Para reportar bugs o solicitar funcionalidades:
1. Verifica que el problema no esté ya reportado
2. Provee información detallada:
   - Descripción del problema
   - Pasos para reproducir
   - Screenshots si es posible
   - Navegador y versión
   - Sistema operativo
3. Envía a: [email de bugs]

### Equipo de Desarrollo
- **Product Owner:** [Nombre]
- **Tech Lead:** [Nombre]
- **Backend Developer:** [Nombre]
- **Frontend Developer:** [Nombre]

---

## 🙏 Agradecimientos

Agradecemos a todos los que han contribuido al desarrollo de este proyecto:
- Equipo de desarrollo de Pumainca
- Comunidad de Next.js y React
- Equipo de Supabase
- Todos los testers y colaboradores

---

<div align="center">

### 🌟 Pumainca Restobar

**Transformando la experiencia gastronómica digital**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.90-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

---

**Hecho con ❤️ por el equipo de Pumainca Restobar**

*Última actualización: Enero 2026*

</div>
