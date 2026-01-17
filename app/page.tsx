"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSiteContent } from '@/lib/queries';

export default function Home() {
  const { data: content } = useSiteContent();

  const title = content?.hero_title ?? "Sabores Auténticos,";
  const subtitle = content?.hero_subtitle ?? "Experiencia Inolvidable.";
  const description = content?.hero_description ?? "Descubre la mejor cocina de autor en un ambiente único y sofisticado. Donde la tradición se encuentra con la innovación en cada plato.";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
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

      {/* History & Philosophy */}
      <section className="py-16 md:py-24 bg-black relative overflow-hidden">
        <div className="container max-w-[1100px] mx-auto px-4 space-y-20 md:space-y-32">
          
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16" id="historia">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                <span className="material-symbols-outlined text-sm">history_edu</span> {content?.history_label ?? "Orígenes"}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {content?.history_title ?? "Raíces profundas en los Andes"}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {content?.history_description ?? "PUMAINCA nació de la pasión por rescatar los sabores ancestrales y fusionarlos con técnicas modernas. Nuestra historia comienza en los valles altos, donde los ingredientes cuentan historias de la tierra y el sol."}
              </p>
              <button className="inline-flex items-center text-primary font-bold hover:text-primary-dark transition-colors border-b-2 border-primary pb-1">
                Leer la historia completa <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
              </button>
            </div>
            <div className="flex-1 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl relative group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3GvdLR0O-ER0B-sxxrf96gAi13pxiiPGAtbv6w6VjPTONsilcTJTXM78DO_lmjKg7DB2uL8HHKbhHMXs-vS6khXEBXFZ2AdZ63PshtY8fBfYqUWM_PD7796N1gmnUPVOL5sdQEfprp531eehNJU17kRuf301TwQNYLclmxY8vQrGN5nTXTTwQj6gCO8eKEssD20UixEwt8kXFlD1lZZ95mNKWGIxOWnSLyIg_5ftjpfp7BzA4dXGWK9htHIfpI7c5HYmWwhpTuvaP" 
                alt="Historia" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16" id="filosofia">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                <span className="material-symbols-outlined text-sm">spa</span> {content?.philosophy_label ?? "Filosofía"}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {content?.philosophy_title ?? "Respeto por el ingrediente"}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {content?.philosophy_description ?? "Creemos que la verdadera cocina comienza en la tierra. Trabajamos directamente con agricultores locales para asegurar la frescura y calidad en cada plato."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-surface-dark p-4 rounded-xl border border-white/10">
                  <span className="material-symbols-outlined text-primary">eco</span>
                  <span className="text-sm font-semibold text-gray-200">{content?.philosophy_badge_1 ?? "100% Orgánico"}</span>
                </div>
                <div className="flex items-center gap-3 bg-surface-dark p-4 rounded-xl border border-white/10">
                  <span className="material-symbols-outlined text-primary">handshake</span>
                  <span className="text-sm font-semibold text-gray-200">{content?.philosophy_badge_2 ?? "Comercio Justo"}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl relative group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDztdE740-TFm6yhUQ3PH1VV9KdanoNC0UmkJ0eIXv7otH1TSK87gsmbwOi2O_sVT05IwslnbE2Uw9bvlyisgCYBW1f3Hgn4Y-ADGT_SVbtQ-3jx6Xa03nzU2QEFZsdT5YpS7nMK9IiyI1NIfLVRyHxcbOrzPyyZGmgtQVf8x4r8CaBFoVZ2nb10uopliC5R8vqEE4-q8bNq2YeKGEa_O0C1db7Yn8TQUYrou8LdZ3xtdmihkOcf9gujQkTXdWCsnVX7zUI9u7FFYiZ" 
                alt="Filosofía" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>

        </div>
      </section>

      {/* Featured Call to Action */}
      <section className="py-24 bg-surface-dark relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfxQRQI_nY_alVkqrgyxhTercMQFH1L_JrrMiE_17KFcyOYzXgs6Hew6Jt_xIO71kyJTwmIH6nyayvR6bayj9QTk-dyQEX3lA3e2MvbQaenoeAlZ6sq9S3vUoZBWJkOIquC4jvCTRMERmgtYbjtyN4Q1wRazaeTZhvooOAk7aQ8C5MIGS0yALbovg16DglqAL6lbYMIuS45PoTT8zU5Xxj1CqNCBuKSpZfqQm6gGtG7-6ETDKmueADaq4vO7TSOt5t9uWGiipSJjw1" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-8">¿Listo para vivir la experiencia?</h2>
          <p className="text-gray-400 text-lg mb-8 md:mb-10 max-w-2xl mx-auto">Reserva tu mesa para este fin de semana y disfruta de nuestro menú degustación especial.</p>
          <Link 
            href="/menu"
            className="bg-primary hover:bg-primary-dark text-white text-lg font-bold px-12 py-4 rounded-full shadow-2xl shadow-red-600/20 transform hover:scale-105 transition-all inline-block w-full sm:w-auto">
            Hacer mi Pedido
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
