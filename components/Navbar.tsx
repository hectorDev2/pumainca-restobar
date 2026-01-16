"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/lib/queries';

interface Props {
  showSearch?: boolean;
}

const Navbar: React.FC<Props> = ({ showSearch = true }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products for in-situ search
  const { data: searchResults, isFetching } = useProducts({ 
    search: debouncedTerm.length >= 2 ? debouncedTerm : "___NO_SEARCH___" // Avoid fetching all if term is short
  });

  const isActive = (path: string) => {
    return pathname === path ? 
      "text-primary transition-colors text-sm font-bold border-b-2 border-primary pb-0.5" : 
      "text-white/80 hover:text-primary transition-colors text-sm font-semibold";
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleManualSearch = () => {
    if (searchTerm.trim()) {
      setShowDropdown(false);
      router.push(`/menu?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <img src="/logo.png" className="w-[120px] group-hover:scale-105 transition-transform" alt="Logo" />
          </Link>

          {showSearch && (
            <div className="hidden md:flex relative w-80" ref={searchContainerRef}>
              <button 
                onClick={handleManualSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                aria-label="Buscar"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
              <input 
                name="nav-search"
                type="text" 
                placeholder="Buscar plato, ingrediente..."
                className="w-full bg-surface-dark border-none rounded-xl pl-12 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/50 transition-all"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!showDropdown) setShowDropdown(true);
                }}
                onFocus={() => {
                    if (searchTerm) setShowDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSearch();
                  }
                }}
                autoComplete="off"
              />

              {/* In-situ Search Dropdown */}
              {showDropdown && searchTerm.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {isFetching ? (
                        <div className="p-4 text-center text-zinc-500 text-sm flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                            Buscando...
                        </div>
                    ) : searchResults && searchResults.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                            {searchResults.slice(0, 5).map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => {
                                        router.push(`/menu?search=${encodeURIComponent(product.name)}`); // Navigate to menu focused on product or just filter
                                        // Alternatively: `/menu/${product.id}` if detail page exists. 
                                        // Logic: User wants to see the product. Menu filter is safest if detail page is modal or not ready.
                                        // Wait, user said "insitu search", usually implies going to the result.
                                        // Let's assume navigating to menu with filter is good, OR detail.
                                        // I'll stick to search param to be safe as per previous request.
                                        // Actually, let's better navigate to search param filter to show it in context.
                                        // Or if detail page /menu/[id] works, that's even better.
                                        // Let's use /menu?search=... for broader context.
                                        setSearchTerm(product.name);
                                        setShowDropdown(false);
                                        router.push(`/menu?search=${encodeURIComponent(product.name)}`);
                                    }}
                                    className="w-full text-left p-3 hover:bg-zinc-800 flex items-center gap-3 transition-colors border-b border-zinc-800/50 last:border-0"
                                >
                                    <div className="size-10 rounded-lg bg-zinc-800 bg-cover bg-center shrink-0" 
                                         style={{ backgroundImage: `url('${product.image || product.image_url || '/placeholder.png'}')` }} 
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-bold truncate">{product.name}</p>
                                        <p className="text-zinc-500 text-xs truncate">{product.category}</p>
                                    </div>
                                    <span className="text-primary text-xs font-bold whitespace-nowrap">
                                        S/. {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                                    </span>
                                </button>
                            ))}
                            <button 
                                onClick={handleManualSearch}
                                className="w-full p-2 text-center text-xs text-primary font-bold hover:bg-zinc-800 transition-colors uppercase tracking-wider"
                            >
                                Ver todos los resultados
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-zinc-500 text-sm">
                            No se encontraron resultados
                        </div>
                    )}
                </div>
              )}
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
