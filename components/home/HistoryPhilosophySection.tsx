"use client";

import React from 'react';
import { useSettings } from '@/lib/queries';
import { MenuImage } from "@/components/ui/menu-image";

export function HistoryPhilosophySection() {
  const { data: content } = useSettings();

  return (
      <section className="py-16 md:py-24 bg-background-dark relative overflow-hidden transition-colors duration-300">
        <div className="container max-w-[1100px] mx-auto px-4 space-y-20 md:space-y-32">
          
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16" id="historia">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2 text-ember-600 font-bold uppercase tracking-wider text-xs">
                <span className="material-symbols-outlined text-sm">history_edu</span> {content?.history_label ?? "Orígenes"}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-cream leading-tight tracking-tight">
                {content?.history_title ?? "Raíces profundas en los Andes"}
              </h2>
              <p className="text-honey text-base md:text-lg leading-relaxed">
                {content?.history_description ?? "PUMAINCA nació de la pasión por rescatar los sabores ancestrales y fusionarlos con técnicas modernas. Nuestra historia comienza en los valles altos, donde los ingredientes cuentan historias de la tierra y el sol."}
              </p>
              <button className="inline-flex items-center text-ember-600 font-bold hover:text-ember-700 transition-colors border-b-2 border-ember-600 pb-1">
                Leer la historia completa <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
              </button>
            </div>
            <div className="flex-1 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl relative group">
              <MenuImage 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3GvdLR0O-ER0B-sxxrf96gAi13pxiiPGAtbv6w6VjPTONsilcTJTXM78DO_lmjKg7DB2uL8HHKbhHMXs-vS6khXEBXFZ2AdZ63PshtY8fBfYqUWM_PD7796N1gmnUPVOL5sdQEfprp531eehNJU17kRuf301TwQNYLclmxY8vQrGN5nTXTTwQj6gCO8eKEssD20UixEwt8kXFlD1lZZ95mNKWGIxOWnSLyIg_5ftjpfp7BzA4dXGWK9htHIfpI7c5HYmWwhpTuvaP" 
                alt="Historia" 
                className="transform group-hover:scale-105 transition-transform duration-700" 
                containerClassName="w-full h-full"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16" id="filosofia">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2 text-ember-600 font-bold uppercase tracking-wider text-xs">
                <span className="material-symbols-outlined text-sm">spa</span> {content?.philosophy_label ?? "Filosofía"}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-cream leading-tight tracking-tight">
                {content?.philosophy_title ?? "Respeto por el ingrediente"}
              </h2>
              <p className="text-honey text-base md:text-lg leading-relaxed">
                {content?.philosophy_description ?? "Creemos que la verdadera cocina comienza en la tierra. Trabajamos directamente con agricultores locales para asegurar la frescura y calidad en cada plato."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-earth-900 p-4 rounded-xl border border-earth-700/30">
                  <span className="material-symbols-outlined text-ember-600">eco</span>
                  <span className="text-sm font-semibold text-cream">{content?.philosophy_badge_1 ?? "100% Orgánico"}</span>
                </div>
                <div className="flex items-center gap-3 bg-earth-900 p-4 rounded-xl border border-earth-700/30">
                  <span className="material-symbols-outlined text-ember-600">handshake</span>
                  <span className="text-sm font-semibold text-cream">{content?.philosophy_badge_2 ?? "Comercio Justo"}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl relative group">
              <MenuImage 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDztdE740-TFm6yhUQ3PH1VV9KdanoNC0UmkJ0eIXv7otH1TSK87gsmbwOi2O_sVT05IwslnbE2Uw9bvlyisgCYBW1f3Hgn4Y-ADGT_SVbtQ-3jx6Xa03nzU2QEFZsdT5YpS7nMK9IiyI1NIfLVRyHxcbOrzPyyZGmgtQVf8x4r8CaBFoVZ2nb10uopliC5R8vqEE4-q8bNq2YeKGEa_O0C1db7Yn8TQUYrou8LdZ3xtdmihkOcf9gujQkTXdWCsnVX7zUI9u7FFYiZ" 
                alt="Filosofía" 
                className="transform group-hover:scale-105 transition-transform duration-700" 
                containerClassName="w-full h-full"
              />
            </div>
          </div>

        </div>
      </section>
  );
}
