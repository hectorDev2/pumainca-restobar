"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar showSearch={false} />
      <div className="pt-8 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">Nuestra Historia</span>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight">
            Tradición y Pasión <br />
            <span className="text-primary">Peruana</span>
          </h1>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-black/40 rounded-3xl z-10 group-hover:bg-transparent transition-colors duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Restaurant Interior" 
              className="relative z-0 rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">El Espíritu de Pumainca</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              En el corazón de nuestra cocina late una pasión milenaria. Pumainca no es solo un restaurante, es un viaje a través de los sabores, aromas y colores del Perú.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Fundado con la misión de honrar nuestras raíces incas, fusionamos técnicas ancestrales con toques contemporáneos para crear experiencias culinarias inolvidables. Cada plato cuenta una historia, cada ingrediente tiene un propósito.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <h4 className="text-4xl font-black text-primary mb-2">2+</h4>
                <p className="text-white font-bold">Años de Tradición</p>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-dark rounded-3xl p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-5xl text-primary mb-6">workspace_premium</span>
            <h3 className="text-3xl font-bold text-white mb-6">Compromiso con la Calidad</h3>
            <p className="text-white/80 text-lg mb-8">
              Trabajamos directamente con agricultores locales para asegurar que solo los ingredientes más frescos lleguen a tu mesa.
            </p>
            <Link 
              href="/menu"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 inline-block"
            >
              Explorar El Menú
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
