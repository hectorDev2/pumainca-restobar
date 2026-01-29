"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/lib/queries';
import { useQueryClient } from '@tanstack/react-query';
import type { Product } from '@/types';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  showSearch?: boolean;
}

const Navbar: React.FC<Props> = ({ showSearch = true }) => {
  const queryClient = useQueryClient();
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

  const fullMenuKey = ["products", null, "", "recommended", null];
  const cachedMenuData = queryClient.getQueryData<Product[]>(fullMenuKey);
  
  const shouldFetchFromServer = debouncedTerm.length >= 2 && !cachedMenuData;

  const { data: serverSearchResults, isFetching } = useProducts({ 
    search: debouncedTerm.length >= 2 ? debouncedTerm : "___NO_SEARCH___",
    limit: 6
  });
  
  // Combine results
  const searchResults = React.useMemo(() => {
    if (debouncedTerm.length < 2) return [];

    if (cachedMenuData) {
        const lowerTerm = debouncedTerm.toLowerCase();
        return cachedMenuData.filter(p => 
            p.name.toLowerCase().includes(lowerTerm) || 
            (p.category && p.category.toLowerCase().includes(lowerTerm))
        ).slice(0, 6);
    }

    return serverSearchResults || [];
  }, [debouncedTerm, cachedMenuData, serverSearchResults]);

  const isLoading = !cachedMenuData && isFetching;

  const isActive = (path: string) => {
    return pathname === path ? 
      "text-primary transition-colors text-sm font-bold border-b-2 border-primary pb-0.5" : 
      "text-text-secondary hover:text-primary transition-colors text-sm font-semibold";
  };

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Categories for Mobile Menu
  const categories = [
    { id: 'todo', name: 'Todo el Menú', icon: 'restaurant' },
    { id: 'platos-principales', name: 'Platos Principales', icon: 'dinner_dining' },
    { id: 'platos-vegetarianos', name: 'Platos Vegetarianos', icon: 'spa' },
    { id: 'pizzas', name: 'Pizzas', icon: 'local_pizza' },
    { id: 'bebidas', name: 'Bebidas', icon: 'local_bar' },
    { id: 'postres', name: 'Postres', icon: 'icecream' },
    { id: 'comida-rapida', name: 'Comida Rápida', icon: 'fastfood' }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-background-dark/95 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
              {/* Mobile Menu Button */}
              <button 
                  className="lg:hidden text-text-primary p-2 -ml-2 hover:bg-surface-hover rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Menu"
              >
                  <span className="material-symbols-outlined text-2xl">
                      {isMenuOpen ? 'close' : 'menu'}
                  </span>
              </button>

            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <NextImage 
  src="/logo.png" 
  width={120} 
  height={40} 
  className="w-[100px] md:w-[120px] group-hover:scale-105 transition-transform h-auto" 
  alt="Logo" 
  priority 
/>
            </Link>

            {showSearch && (
              <div className="hidden md:flex relative w-60 lg:w-80" ref={searchContainerRef}>
                <button 
                  onClick={handleManualSearch}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Buscar"
                >
                  <span className="material-symbols-outlined">search</span>
                </button>
                <input 
                  name="nav-search"
                  type="text" 
                  placeholder="Buscar..."
                  className="w-full bg-surface-dark border-none rounded-xl pl-12 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary/50 transition-all"
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background-dark border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {isLoading ? (
                          <div className="p-4 text-center text-text-secondary text-sm flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                              Buscando...
                          </div>
                      ) : searchResults && searchResults.length > 0 ? (
                          <div className="max-h-80 overflow-y-auto">
                              {searchResults.slice(0, 5).map(product => (
                                  <button
                                      key={product.id}
                                      onClick={() => {
                                          setSearchTerm("");
                                          setShowDropdown(false);
                                          router.push(`/menu/${product.id}`);
                                      }}
                                      className="w-full text-left p-3 hover:bg-surface-hover flex items-center gap-3 transition-colors border-b border-zinc-800/50 last:border-0"
                                  >
                                      <div className="size-10 rounded-lg bg-surface-dark bg-cover bg-center shrink-0" 
                                           style={{ backgroundImage: `url('${product.image_url || '/placeholder.png'}')` }} 
                                      />
                                      <div className="flex-1 min-w-0">
                                          <p className="text-text-primary text-sm font-bold truncate">{product.name}</p>
                                          <p className="text-text-secondary text-xs truncate">{product.category}</p>
                                      </div>
                                      <span className="text-primary text-xs font-bold whitespace-nowrap">
                                          S/. {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                                      </span>
                                  </button>
                              ))}
                              <button 
                                  onClick={handleManualSearch}
                                  className="w-full p-2 text-center text-xs text-primary font-bold hover:bg-surface-hover transition-colors uppercase tracking-wider"
                              >
                                  Ver todos los resultados
                              </button>
                          </div>
                      ) : (
                          <div className="p-4 text-center text-text-secondary text-sm">
                              No se encontraron resultados
                          </div>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-8">
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/menu" className={isActive('/menu')}>Menú</Link>
              <Link href="/nosotros" className={isActive('/nosotros')}>Nosotros</Link>
              <Link href="/reservas" className={isActive('/reservas')}>Reservas</Link>
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              <AnimatedThemeToggler />
              <Link 
                href="/menu"
                className="bg-primary hover:bg-primary-dark text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-red-900/30 transition-all active:scale-95 whitespace-nowrap">
                Mi Orden
              </Link>
              <Link 
                href="/cart"
                className="relative flex items-center justify-center size-9 sm:size-10 bg-surface-dark hover:bg-surface-hover rounded-xl border border-zinc-800 transition-colors">
                <span className="material-symbols-outlined text-text-primary text-lg sm:text-xl">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-4 sm:size-5 bg-primary text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background-dark">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Moved outside of nav to prevent containment by backdrop-blur or sticky */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="lg:hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 z-[101] w-[280px] bg-black border-r border-zinc-800 flex flex-col overflow-y-auto shadow-2xl"
            >
                {/* Drawer Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-black z-20">
                    <div className="flex items-center gap-3">
                        <NextImage src="/logo.png" width={96} height={32} className="w-24 h-auto" alt="Logo" />
                    </div>
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="p-6 space-y-8">
                    {/* Navigation Links */}
                    <div className="space-y-1">
                        <Link 
                            href="/menu" 
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${pathname === '/menu' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined">restaurant_menu</span>
                            Menú
                        </Link>
                        <Link 
                            href="/nosotros" 
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${pathname === '/nosotros' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                        >
                             <span className="material-symbols-outlined">groups</span>
                            Nosotros
                        </Link>
                        <Link 
                            href="/reservas" 
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${pathname === '/reservas' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                        >
                             <span className="material-symbols-outlined">calendar_today</span>
                            Reservas
                        </Link>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Categories Section */}
                    <div className="space-y-4">
                        <div className="flex flex-col px-2">
                            <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-1">Menú</h3>
                            <p className="text-zinc-500 text-xs">Explorar por categoría</p>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        router.push(`/menu?category=${cat.id}`);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative z-10 group outline-none text-zinc-400 hover:text-white hover:bg-zinc-900"
                                >
                                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">{cat.icon}</span>
                                    <span className="text-sm font-bold">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col px-2">
                            <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-1">Dietética</h3>
                            <p className="text-zinc-500 text-xs">Filtros rápidos</p>
                        </div>
                        <div className="space-y-3 px-4">
                            {['Vegetariano', 'Vegano', 'Sin Gluten'].map((label) => (
                            <label key={label} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 bg-zinc-900 border-zinc-700 rounded text-primary focus:ring-0 focus:ring-offset-0" />
                                <span className="text-zinc-400 text-sm font-medium group-hover:text-white transition-colors">{label}</span>
                            </label>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
