"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/lib/queries";

function HeroContent() {
  const { data: content } = useSettings();

  const title = content?.hero_title ?? "Sabores Auténticos,";
  const subtitle = content?.hero_subtitle ?? "Experiencia Inolvidable.";
  const description =
    content?.hero_description ??
    "Descubre la mejor cocina de autor en un ambiente único y sofisticado. Donde la tradición se encuentra con la innovación en cada plato.";

  return (
    <>
      <h1 className="text-cream text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
        {title}
        <br />
        <span className="text-ember-600">{subtitle}</span>
      </h1>
      <p className="text-honey text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-10 text-opacity-90">
        {description}
      </p>
    </>
  );
}

function HeroFallback() {
  return (
    <>
      <h1 className="text-cream text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
        Sabores Auténticos,
        <br />
        <span className="text-ember-600">Experiencia Inolvidable.</span>
      </h1>
      <p className="text-honey text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-10 text-opacity-90">
        Descubre la mejor cocina de autor en un ambiente único y sofisticado.
      </p>
    </>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] w-full flex-col justify-center items-center overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuATXk6MPNKGx57CMdde5-DdiTX5gT1k4FcksnnlebD-cSsZFtfTZkEOgg_qGAjRMBkKnN4lRmk49DGt_CkCnIJFhxgb4ErT87gcJieqE--4p4lwbdOPE_2u4PSiak7lkRXM5tG1-Rg1GaX7rKU8PVe4hgi63r5GhAuwJt4_rxs6JEmmq-BxmIeVKzoWkYRiXEjFcbdZPwWSsXPmoMFDY0TmAY9VuYan0app-qcECaPVlAWW08ArAi-n6B_nzpEYj3gAopAgZ-06bNJZ"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
          quality={85}
          sizes="100vw"
        />
        {/* Gradiente orgánico: de brasas a tierra */}
        <div className="absolute inset-0 bg-gradient-to-b from-ember-900/50 via-earth-900/70 to-earth-950" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-700/20 text-ember-600 border border-ember-600/30 text-xs font-bold mb-6 tracking-wide uppercase backdrop-blur-sm">
          <span className="material-symbols-outlined text-sm">stars</span>{" "}
          Experiencia Gastronómica
        </div>

        <Suspense fallback={<HeroFallback />}>
          <HeroContent />
        </Suspense>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/menu"
            className="group w-full sm:w-auto min-w-[180px] h-14 bg-ember-600 hover:bg-ember-700 text-cream text-base font-bold rounded-md transition-all duration-300 shadow-lg shadow-ember-900/40 hover:shadow-ember-800/60 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
              restaurant_menu
            </span>
            Ver Menú
          </Link>
          <Link
            href="/reservas"
            className="group w-full sm:w-auto min-w-[180px] h-14 bg-earth-800/60 hover:bg-earth-800 backdrop-blur-md border border-honey/20 hover:border-honey/40 text-cream text-base font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
              calendar_month
            </span>
            Reservar Mesa
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-ember-600/70 z-10">
        <span className="material-symbols-outlined text-4xl">expand_more</span>
      </div>
    </section>
  );
}
