"use client";

import React from 'react';
import Link from 'next/link';
import { useSettings } from '@/lib/queries';

export function HeroSection() {
  const { data: content } = useSettings();

  const title = content?.hero_title ?? "Sabores Auténticos,";
  const subtitle = content?.hero_subtitle ?? "Experiencia Inolvidable.";
  const description = content?.hero_description ?? "Descubre la mejor cocina de autor en un ambiente único y sofisticado. Donde la tradición se encuentra con la innovación en cada plato.";

  return (
      <section className="relative flex min-h-[85vh] w-full flex-col justify-center items-center">
        <div className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all" 
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(5,5,5,1) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuATXk6MPNKGx57CMdde5-DdiTX5gT1k4FcksnnlebD-cSsZFtfTZkEOgg_qGAjRMBkKnN4lRmk49DGt_CkCnIJFhxgb4ErT87gcJieqE--4p4lwbdOPE_2u4PSiak7lkRXM5tG1-Rg1GaX7rKU8PVe4hgi63r5GhAuwJt4_rxs6JEmmq-BxmIeVKzoWkYRiXEjFcbdZPwWSsXPmoMFDY0TmAY9VuYan0app-qcECaPVlAWW08ArAi-n6B_nzpEYj3gAopAgZ-06bNJZ')` }}>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold mb-6 tracking-wide uppercase backdrop-blur-sm">
            <span className="material-symbols-outlined text-sm">stars</span> Experiencia Gastronómica
          </div>
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 drop-shadow-2xl">
            {title}<br/>
            <span className="text-primary">{subtitle}</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-10 text-opacity-90">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/menu"
              className="w-full sm:w-auto min-w-[180px] h-14 bg-primary hover:bg-primary-dark text-white text-base font-bold rounded-md transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">restaurant_menu</span>
              Ver Menú
            </Link>
            <Link 
              href="/reservas"
              className="w-full sm:w-auto min-w-[180px] h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-base font-bold rounded-md transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">calendar_month</span>
              Reservar Mesa
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-primary/70">
          <span className="material-symbols-outlined text-4xl">expand_more</span>
        </div>
      </section>
  );
}
