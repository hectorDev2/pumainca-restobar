"use client";

import React, { memo, useState } from 'react';
import Link from 'next/link';
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { MenuImage } from "@/components/ui/menu-image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export const RecommendedCard = memo(function RecommendedCard({ product }: { product: Product }) {
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <NeonGradientCard 
      neonColor="#E63946"
      secondaryColor="#D62828"
      className="h-[450px] cursor-pointer !p-0 relative overflow-hidden"
      noInnerContainer
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {/* Signature: Llama Flotante - resplandor ember desde abajo */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-ember-700/30 via-ember-600/10 to-transparent transition-opacity duration-500 pointer-events-none z-[1] ${
          isCardHovered ? 'opacity-100 animate-glow-ember' : 'opacity-0'
        }`}
      />
      
      <div className="flex flex-col gap-4 w-full h-full overflow-hidden relative z-[3] box-border p-6">
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-ember-800/20 shrink-0 group/image">
          <MenuImage
            src={product.image_url}
            alt={product.name}
            containerClassName="w-full h-full"
            className="group-hover/image:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="space-y-2 shrink-0">
          <h3 className={`text-2xl font-black tracking-tight transition-colors duration-300 ${
            isCardHovered ? 'text-ember-600' : 'text-cream'
          }`}>
            {product.name}
          </h3>
          <div className="h-px w-12 bg-gradient-to-r from-ember-600 to-transparent" />
        </div>
        
        <div className="space-y-3 flex-1 min-h-0 flex flex-col overflow-hidden">
          <p className="text-xs font-bold text-cream uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(230,57,70,0.5)]">
            {formatPrice(product.price)}
          </p>
          <p className="text-sm text-honey font-medium leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>

        <div className="mt-auto">
          <Link
            href="/menu"
            className="block w-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-honey hover:text-cream transition-colors border border-earth-700 rounded-full hover:border-ember-600 text-center"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </NeonGradientCard>
  );
});
