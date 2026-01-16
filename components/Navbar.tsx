"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface Props {
  showSearch?: boolean;
}

const Navbar: React.FC<Props> = ({ showSearch = true }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();

  const isActive = (path: string) => {
    return pathname === path ? 
      "text-primary transition-colors text-sm font-bold border-b-2 border-primary pb-0.5" : 
      "text-white/80 hover:text-primary transition-colors text-sm font-semibold";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <img src="/logo.png" className="w-[120px] group-hover:scale-105 transition-transform" alt="Logo" />
          </Link>

          {showSearch && (
            <div className="hidden md:flex relative w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
              <input 
                type="text" 
                placeholder="Buscar plato, ingrediente..."
                className="w-full bg-surface-dark border-none rounded-xl pl-12 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/50 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const term = (e.target as HTMLInputElement).value;
                    if (term.trim()) {
                      router.push(`/menu?search=${encodeURIComponent(term)}`);
                    }
                  }
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/menu" className={isActive('/menu')}>Menú</Link>
            <Link href="/nosotros" className={isActive('/nosotros')}>Nosotros</Link>
            <Link href="/reservas" className={isActive('/reservas')}>Reservas</Link>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/menu"
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-900/30 transition-all active:scale-95">
              Mi Orden
            </Link>
            <Link 
              href="/cart"
              className="relative flex items-center justify-center size-10 bg-surface-dark hover:bg-surface-hover rounded-xl border border-zinc-800 transition-colors">
              <span className="material-symbols-outlined text-white">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-black">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
