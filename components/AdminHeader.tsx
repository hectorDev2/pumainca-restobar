"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AdminHeader: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) =>
    pathname === path
      ? "text-primary transition-colors text-sm font-bold border-b-2 border-primary pb-0.5"
      : "text-white/80 hover:text-primary transition-colors text-sm font-semibold";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" className="w-27.5" alt="Logo" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className={isActive("/admin")}>
              Dashboard
            </Link>
            <Link
              href="/admin/categories"
              className={isActive("/admin/categories")}
            >
              Categorías
            </Link>
            <Link href="/admin/orders" className={isActive("/admin/orders")}>
              Pedidos
            </Link>
            <Link
              href="/admin/settings"
              className={isActive("/admin/settings")}
            >
              Ajustes
            </Link>

            <Link
              href="/admin/reservations"
              className={isActive("/admin/reservations")}
            >
              Reservas
            </Link>
            <Link href="/admin/content" className={isActive("/admin/content")}>
              Contenido
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-zinc-400 mr-3 hidden sm:block">
            {user?.email}
          </div>
          <button
            onClick={() => logout()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
