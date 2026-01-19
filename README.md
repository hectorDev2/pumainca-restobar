<div align="center">
<img width="300" src="/logo.png" alt="Pumainca Restobar Logo" />
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
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Librería UI:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript 5.8](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) con diseño responsivo y personalizado
- **Animaciones:** [Framer Motion 12](https://www.framer.com/motion/)
- **Iconos:** Material Symbols Outlined
- **Fechas:** [React DatePicker 9](https://reactdatepicker.com/)

### Backend/Database
- **BaaS:** [Supabase](https://supabase.com/)
  - PostgreSQL (Base de datos)
  - Auth (Autenticación con JWT)
  - Storage (Almacenamiento de imágenes)
- **Data Fetching:** [TanStack Query (React Query) v5](https://tanstack.com/query)

### Servicios Externos
- **CDN de Imágenes:** [ImageKit.io](https://imagekit.io/)
- **Hosting:** Vercel (recomendado)

### DevOps & Testing
- **Control de Versiones:** Git
- **Package Manager:** npm / bun
- **Build Tool:** Next.js (Turbopack)
- **Testing:** [Playwright](https://playwright.dev/) con Python (E2E tests)

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

---

## 🛠️ Instalación y Configuración

### Opción 1: Instalación Local (Sin Docker)

#### Prerrequisitos
- **Node.js** 18+ o **Bun** 1.0+
- Cuenta en [Supabase](https://supabase.com/)
- Cuenta en [ImageKit.io](https://imagekit.io/) (opcional, para CDN de imágenes)

#### Pasos de Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/pumainca-restobar.git
   cd pumainca-restobar
   ```

2. **Instalar dependencias**:
   ```bash
   # Con npm
   npm install
   
   # O con bun (recomendado)
   bun install
   ```

3. **Configurar Variables de Entorno**:
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   
   # ImageKit (opcional)
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=tu_imagekit_url_endpoint
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=tu_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=tu_imagekit_private_key
   
   # API Base URL (si usas backend externo)
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   ```

4. **Configurar Base de Datos**:
   
   Ejecuta los scripts de migración o configura las tablas en tu dashboard de Supabase:
   - `products` - Productos del menú
   - `categories` - Categorías de productos
   - `subcategories` - Subcategorías
   - `orders` - Pedidos
   - `order_items` - Items de pedidos
   - `reservations` - Reservas
   - `site_content` - Contenido del sitio

   Consulta `ESTRUCTURA_BASE_DATOS.md` para el esquema completo.

5. **Ejecutar el servidor de desarrollo**:
   ```bash
   # Con npm
   npm run dev
   
   # O con bun
   bun dev
   ```
   
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

6. **Acceder al panel de administración**:
   - Navega a `/admin` o `/login`
   - Inicia sesión con tus credenciales de administrador

### Opción 2: Instalación con Docker (Recomendado)

#### Prerrequisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado
- Docker Compose v3.8+

#### Pasos Rápidos

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/pumainca-restobar.git
   cd pumainca-restobar
   ```

2. **Configurar Variables de Entorno**:
   
   Crea `.env.local` con tus credenciales (ver Opción 1, paso 3)

3. **Iniciar con Docker**:
   ```bash
   # Desarrollo
   npm run docker:dev
   
   # O directamente
   docker-compose up
   ```

4. **Acceder a la aplicación**:
   - Abre [http://localhost:3000](http://localhost:3000)
   - Los cambios en el código se reflejan automáticamente (hot reload)

#### Comandos Docker Útiles

```bash
# Desarrollo
npm run docker:dev          # Iniciar entorno de desarrollo
npm run docker:dev:logs     # Ver logs en tiempo real
npm run docker:dev:down     # Detener contenedores

# Producción
npm run docker:build        # Construir imagen de producción
npm run docker:prod         # Iniciar en modo producción
npm run docker:prod:logs    # Ver logs de producción
```

📖 **Documentación completa de Docker**: Ver [DOCKER.md](./DOCKER.md) para más detalles sobre despliegue, troubleshooting y configuración avanzada.

---

## 📱 Estructura del Proyecto

```
pumainca-restobar/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (endpoints internos)
│   │   ├── products/            # Endpoints de productos
│   │   ├── orders/              # Endpoints de pedidos
│   │   ├── reservations/        # Endpoints de reservas
│   │   ├── categories/          # Endpoints de categorías
│   │   └── upload/              # Endpoint de subida de archivos
│   ├── admin/                   # Páginas protegidas del panel admin
│   │   ├── page.tsx            # Gestión de productos
│   │   ├── orders/             # Gestión de pedidos
│   │   ├── reservations/       # Gestión de reservas
│   │   ├── content/            # Gestión de contenido
│   │   └── settings/           # Configuración
│   ├── menu/                    # Menú público
│   │   ├── page.tsx            # Lista de productos
│   │   └── [id]/               # Detalle de producto
│   ├── cart/                    # Carrito de compras
│   ├── checkout/                # Proceso de checkout
│   ├── reservas/                # Formulario de reservas
│   ├── login/                   # Página de login
│   └── page.tsx                 # Página de inicio
├── components/                   # Componentes UI reutilizables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── ...
├── context/                      # Estado global
│   ├── AuthContext.tsx          # Contexto de autenticación
│   └── CartContext.tsx          # Contexto del carrito
├── lib/                          # Utilidades y configuración
│   ├── api.ts                   # Cliente API
│   ├── queries.ts               # React Query hooks
│   ├── supabase.ts              # Cliente Supabase
│   └── imagekit.ts              # Cliente ImageKit
├── types.ts                      # Definiciones de tipos TypeScript
├── tests/                        # Tests E2E con Playwright
│   ├── TC001_*.py               # Tests de casos de uso
│   └── tmp/                      # Configuración y reportes
├── public/                       # Archivos estáticos
└── package.json                  # Dependencias y scripts
```

---

## 🧪 Testing

El proyecto incluye tests end-to-end (E2E) con Playwright y Python:

```bash
# Los tests están en la carpeta tests/
# Ejecutar tests individuales:
python tests/TC001_Homepage_Load_Performance_and_UI_Rendering.py

# O usar TestSprite para ejecutar todos los tests:
# (requiere configuración de TestSprite)
```

### Tests Disponibles
- TC001: Homepage Load Performance and UI Rendering
- TC002: Menu Filtering and Search Functionality
- TC003: Detailed Product View Display
- TC004: Shopping Cart Quantity Management
- TC005: Checkout Form Validation
- TC006: Order Confirmation Email Delivery
- TC007: Reservation Form Validation
- TC008: Reservation Confirmation Email Delivery
- TC009: Admin Authentication and Route Protection
- TC010: Product CRUD Operations
- TC011: Category Management CRUD
- TC012: Orders Management
- TC013: Reservations Management
- TC014: API Endpoint HTTP Status Codes
- TC015: Real-Time UI Updates with React Query
- TC016: Shopping Cart Tax Calculation
- TC017: Checkout Pickup Time Validation
- TC018: Admin Dashboard Accessibility

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (puerto 3000)
npm run start:dev    # Alias de dev

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Linting
npm run lint         # Ejecuta ESLint
```

---

## 🎯 Requisitos de Rendimiento

| Métrica | Objetivo | Estado |
|---------|----------|--------|
| Tiempo de carga inicial | < 2s | ✅ |
| First Contentful Paint (FCP) | < 1.5s | ✅ |
| Time to Interactive (TTI) | < 3s | ✅ |
| Lighthouse Score | > 90 | ⚠️ Verificar |
| Core Web Vitals | Aprobado | ⚠️ Verificar |

---

## 🌐 Compatibilidad

### Navegadores Soportados
- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Opera 76+ ✅
- Navegadores móviles (iOS Safari, Chrome Android) ✅

### Dispositivos
- Desktop (1920x1080 y superior) ✅
- Laptop (1366x768 y superior) ✅
- Tablet (768x1024) ✅
- Móvil (375x667 y superior) ✅

---

## 🔐 Seguridad y Autenticación

- Autenticación mediante Supabase Auth (JWT tokens)
- Rutas protegidas con middleware de autenticación
- Validación de roles y permisos
- Protección CSRF en formularios
- Sanitización de inputs del usuario

---

## 📊 Arquitectura del Sistema

```
┌─────────────────────────────────────────┐
│         FRONTEND (Next.js)              │
│  ┌──────────┐  ┌──────────┐            │
│  │ Páginas  │  │Componentes│           │
│  │ Públicas │  │    UI    │            │
│  └──────────┘  └──────────┘            │
│         │            │                  │
│         └─────┬──────┘                  │
│               │                          │
│        ┌──────▼──────┐                  │
│        │ React Query │                  │
│        │(Data Cache) │                  │
│        └──────┬──────┘                  │
└───────────────┼─────────────────────────┘
                │ HTTP/REST
                │
┌───────────────▼─────────────────────────┐
│      API ROUTES (Next.js)                │
│  /products │ /orders │ /reservations    │
└───────────────┬─────────────────────────┘
                │
        ┌───────▼───────┐
        │ Supabase SDK  │
        └───────┬───────┘
                │
┌───────────────▼─────────────────────────┐
│         SUPABASE                        │
│  PostgreSQL │ Auth │ Storage            │
└─────────────────────────────────────────┘
```

---

## 🚀 Despliegue

### Opción 1: Vercel (Recomendado para Next.js)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Vercel detectará automáticamente Next.js y desplegará

### Opción 2: Docker (Recomendado para control total)

El proyecto está completamente dockerizado y puede desplegarse en cualquier plataforma que soporte Docker y contenedores.

#### Plataformas Cloud que soportan Docker

- **Railway**: Detecta Dockerfile automáticamente
- **Render**: Soporte nativo para Docker
- **Fly.io**: Optimizado para Docker
- **AWS ECS/Fargate**: Contenedores escalables
- **Google Cloud Run**: Serverless con Docker
- **Azure Container Instances**: Contenedores en Azure
- **DigitalOcean App Platform**: Deploy con Docker

#### Pasos rápidos con scripts incluidos

1. Clona el repositorio y crea el archivo `.env.local` con tus variables de entorno.
2. Ejecuta `npm run docker:dev` para levantar el stack de desarrollo o `npm run docker:prod` para producción.
3. `scripts/docker-compose-wrapper.sh` detecta automáticamente si el sistema expone `docker compose` o el binario `docker-compose` para garantizar compatibilidad.

#### Despliegue rápido con Docker

```bash
# 1. Build de la imagen
docker build -t pumainca-restobar .

# 2. Ejecutar localmente para probar
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=tu_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key \
  pumainca-restobar

# 3. O usar docker-compose para producción
docker-compose -f docker-compose.prod.yml up -d
```

📖 **Guía completa de Docker**: Ver [DOCKER.md](./DOCKER.md) para instrucciones detalladas de despliegue en diferentes plataformas.

### Opción 3: Otros Proveedores

El proyecto puede desplegarse en cualquier plataforma que soporte Next.js:
- Netlify
- AWS Amplify
- Cloudflare Pages

---

## 📝 Licencia

Este proyecto es propiedad de **Pumainca Restobar**. Todos los derechos reservados.

---

## 👥 Contribución

Este es un proyecto privado. Para contribuciones, contacta al equipo de desarrollo.

---

## 📞 Soporte

Para soporte técnico o consultas, contacta al equipo de desarrollo de Pumainca Restobar.

---

## 🧰 Comandos Útiles

### Desarrollo y pruebas locales

- `npm run dev` / `bun dev`: ejecuta Next.js en modo desarrollo con hot reload.
- `npm run start:dev`: alias a `npm run dev`.
- `npm run build`: genera el build optimizado.
- `npm run start`: ejecuta el build en modo producción local.
- `npm run lint`: corre ESLint con la configuración de Next.js.

### Docker y contenedores

- `npm run docker:dev`: arranca el stack de desarrollo mediante `scripts/docker-compose-wrapper.sh`.
- `npm run docker:dev:build`: reconstruye las imágenes del entorno de desarrollo.
- `npm run docker:dev:down`: detiene y elimina los contenedores del entorno de desarrollo.
- `npm run docker:dev:logs`: muestra los logs en tiempo real del entorno de desarrollo.
- `npm run docker:build`: construye la imagen de producción `pumainca-restobar`.
- `npm run docker:prod`: levanta los servicios definidos en `docker-compose.prod.yml` (con el wrapper detectando `docker compose` o `docker-compose`).
- `npm run docker:prod:build`, `npm run docker:prod:down`, `npm run docker:prod:logs`: lleva la gestión completa del entorno de producción.

---

<div align="center">
<p>Desarrollado con ❤️ para Pumainca Restobar</p>
</div>
