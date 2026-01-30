/**
 * Rutas de la aplicación
 */

export const ROUTES = {
  // Public
  HOME: "/",
  MENU: "/menu",
  CART: "/cart",
  CHECKOUT: "/checkout",
  RESERVAS: "/reservas",
  NOSOTROS: "/nosotros",
  LOGIN: "/login",
  OFFLINE: "/offline",

  // Admin
  ADMIN: {
    HOME: "/admin",
    DASHBOARD: "/admin",
    PRODUCTS: "/admin/products",
    CATEGORIES: "/admin/categories",
    ORDERS: "/admin/orders",
    RESERVATIONS: "/admin/reservations",
    SETTINGS: "/admin/settings",
    CONTENT: "/admin/content",
  },
} as const;

export const ADMIN_NAV_ITEMS = [
  { href: ROUTES.ADMIN.DASHBOARD, label: "Dashboard" },
  { href: ROUTES.ADMIN.CATEGORIES, label: "Categorías" },
  { href: ROUTES.ADMIN.ORDERS, label: "Pedidos" },
  { href: ROUTES.ADMIN.RESERVATIONS, label: "Reservas" },
  { href: ROUTES.ADMIN.CONTENT, label: "Contenido" },
  { href: ROUTES.ADMIN.SETTINGS, label: "Ajustes" },
] as const;
