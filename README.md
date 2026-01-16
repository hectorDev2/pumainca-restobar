<div align="center">
<img width="300" src="/logo.png" alt="Pumainca Restobar Logo" />
<h1>Pumainca Restobar</h1>
<p>Aplicación Web Moderna para Gestión de Restaurante</p>
</div>

## 📋 Descripción

**Pumainca Restobar** es una plataforma web completa desarrollada para la gestión eficiente de pedidos, reservas y administración del restaurante. Ofrece una experiencia de usuario premium con un diseño oscuro elegante ("Dark Mode") y animaciones fluidas.

El sistema permite a los clientes explorar el menú, realizar pedidos para recoger, y reservar mesas en línea. Para la administración, cuenta con un panel de control seguro para gestionar productos, pedidos en tiempo real y reservas.

---

## 🚀 Tecnologías

El proyecto está construido con un stack moderno y robusto:

-   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), React 19.
-   **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/) con diseño responsivo y personalizado.
-   **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage).
-   **Estado & Data Fetching**: [React Query (TanStack Query)](https://tanstack.com/query) v5.
-   **Iconos**: Material Symbols Outlined.

---

## ✨ Características Principales

### 🛒 Cliente (Público)
-   **Menú Digital**: Exploración de productos por categorías (Entradas, Platos de Fondo, Bebidas, etc.).
-   **Carrito de Compras**:
    -   Gestión de items, cantidad y subtotales.
    -   **Precios con IGV Incluido**: Cálculo transparente para el cliente.
    -   Sin tarifas de servicio ocultas.
-   **Checkout**:
    -   Formulario de contacto y tiempo estimado de recogida.
    -   Confirmación de pedidos con número único de seguimiento.
-   **Reservas**:
    -   Formulario para reservar mesa (Fecha, Hora, Personas).
    -   Validación de datos y confirmación inmediata.

### 🛡️ Panel de Administración (`/admin`)
Acceso protegido mediante autenticación.

-   **Dashboard**: Vista general del sistema.
-   **Gestión de Pedidos (`/admin/orders`)**:
    -   Tabla detallada con estado de pago, cliente y total.
    -   **Actualización de Estado**: Cambia entre *Pendiente, Confirmado, Completado, Cancelado* directamente desde la tabla.
    -   **Vista Detallada**: Modal con lista de items, precios unitarios y notas especiales.
-   **Gestión de Reservas (`/admin/reservations`)**:
    -   Historial completo de reservas.
    -   Filtros por Email o Código de Reserva.
    -   **Gestión de Estado**: Aprueba o cancela reservas con un clic.
-   **Inventario**:
    -   Creación y edición de productos.
    -   Subida de imágenes (Supabase Storage).
-   **Configuración**:
    -   Gestión de cuenta de administrador (Email/Password).

---

## 🛠️ Instalación y Configuración

### Prerrequisitos
-   Node.js 18+
-   Cuenta en Supabase

### Pasos

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/pumainca-restobar.git
    cd pumainca-restobar
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env.local` en la raíz y añade tus credenciales de Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
    ```

4.  **Base de Datos**:
    Ejecuta los scripts de migración o configura las tablas (`products`, `orders`, `reservations`, `categories`) en tu dashboard de Supabase.

5.  **Correr el servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📱 Estructura del Proyecto

-   `/app`: Rutas y páginas (Next.js App Router).
    -   `/api`: Endpoints internos para comunicación segura con Supabase.
    -   `/admin`: Páginas protegidas del panel de control.
-   `/components`: Componentes UI reutilizables (Botones, Inputs, Modales).
-   `/context`: Estado global (AuthContext, CartContext).
-   `/lib`: Utilidades y configuración de clientes (Supabase, React Query).

---

## 📄 Licencia

Este proyecto es propiedad de **Pumainca Restobar**. Todos los derechos reservados.
