
import React from 'react';
import { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
  cartCount: number;
  showSearch?: boolean;
  activeScreen?: Screen;
}

const Navbar: React.FC<Props> = ({ onNavigate, cartCount, showSearch = true, activeScreen }) => {
  const getLinkClass = (screen: Screen) => {
    return activeScreen === screen 
      ? "text-primary transition-colors text-sm font-bold border-b-2 border-primary pb-0.5" 
      : "text-white/80 hover:text-primary transition-colors text-sm font-semibold";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <img src="/logo.png" className="w-[120px] group-hover:scale-105 transition-transform" alt="Logo" />
          </div>

          {showSearch && (
            <div className="hidden md:flex relative w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
              <input 
                type="text" 
                placeholder="Buscar plato, ingrediente..."
                className="w-full bg-surface-dark border-none rounded-xl pl-12 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => onNavigate('menu')} className={getLinkClass('menu')}>Menú</button>
            <button onClick={() => onNavigate('nosotros')} className={getLinkClass('nosotros')}>Nosotros</button>
            <button onClick={() => onNavigate('reservas')} className={getLinkClass('reservas')}>Reservas</button>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate('menu')}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-900/30 transition-all active:scale-95">
              Mi Orden
            </button>
            <button 
              onClick={() => onNavigate('cart')}
              className="relative flex items-center justify-center size-10 bg-surface-dark hover:bg-surface-hover rounded-xl border border-zinc-800 transition-colors">
              <span className="material-symbols-outlined text-white">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
