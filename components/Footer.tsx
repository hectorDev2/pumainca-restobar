"use client";

import React from 'react';
import { useSettings } from '@/lib/queries';
import NextImage from 'next/image';

const Footer: React.FC = () => {
  const { data: content } = useSettings();

  return (
    <footer className="bg-earth-950 border-t border-earth-700/20 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="mb-4">
              <NextImage src="/logo.png" width={150} height={50} className="w-[150px] h-auto" alt="Pumainca" />
            </div>
            <p className="text-honey/80 text-sm leading-relaxed">
              {content?.footer_description ?? "Cocina de autor con raíces andinas y visión contemporánea. Una experiencia culinaria diseñada para despertar los sentidos."}
            </p>
          </div>
          <div>
            <h4 className="text-ember-600 font-bold mb-6 text-xs uppercase tracking-[0.2em]">Explorar</h4>
            <ul className="space-y-3">
              <li><button className="text-honey/80 hover:text-cream text-sm transition-colors">Menú Degustación</button></li>
              <li><button className="text-honey/80 hover:text-cream text-sm transition-colors">Eventos Privados</button></li>
              <li><button className="text-honey/80 hover:text-cream text-sm transition-colors">Nuestro Equipo</button></li>
              <li><button className="text-honey/80 hover:text-cream text-sm transition-colors">Gift Cards</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-ember-600 font-bold mb-6 text-xs uppercase tracking-[0.2em]">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-ember-600 text-sm mt-0.5">location_on</span>
                <span className="text-honey/80 text-sm whitespace-pre-line">{content?.contact_address ?? "Av. La Mar 1234, Miraflores\nLima, Perú"}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-ember-600 text-sm">call</span>
                <span className="text-honey/80 text-sm">{content?.contact_phone ?? "+51 1 555-0199"}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-ember-600 font-bold mb-6 text-xs uppercase tracking-[0.2em]">Horario</h4>
            <ul className="space-y-2">
              <li className="flex justify-between text-sm">
                <span className="text-honey/80">Mar - Jue</span>
                <span className="text-cream font-medium">12:30 - 23:00</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-honey/80">Vie - Sáb</span>
                <span className="text-cream font-medium">12:30 - 00:00</span>
              </li>
              <li className="flex justify-between text-sm mt-2">
                <span className="text-honey/60">Lunes</span>
                <span className="text-red-500/50 text-xs font-bold uppercase py-0.5 px-2 bg-red-500/5 rounded">Cerrado</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-earth-700/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-honey/60 text-[10px] uppercase font-bold tracking-widest tracking-tighter">© 2024 PUMAINCA RESTOBAR. Sabores de la Tierra.</p>
          <div className="flex gap-6">
            <button className="text-honey/60 hover:text-cream text-xs transition-colors">Privacidad</button>
            <button className="text-honey/60 hover:text-cream text-xs transition-colors">Términos</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
