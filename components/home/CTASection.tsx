"use client";

import React from 'react';
import Link from 'next/link';

export function CTASection() {
  return (
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
  );
}
