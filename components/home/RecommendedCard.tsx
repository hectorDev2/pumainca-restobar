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
      neonColor="#FF0000"
      secondaryColor="#cc0000"
      className="h-[450px] cursor-pointer !p-0"
      noInnerContainer
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div className="flex flex-col gap-4 w-full h-full overflow-hidden relative z-[3] box-border p-6">
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#FF0000]/20 shrink-0 group/image">
          <MenuImage
            src={product.image_url}
            alt={product.name}
            containerClassName="w-full h-full"
            className="group-hover/image:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="space-y-2 shrink-0">
          <h3 className={`text-2xl font-black tracking-tight transition-colors duration-300 ${isCardHovered ? 'text-[#FF0000]' : 'text-white'}`}>
            {product.name}
          </h3>
          <div className="h-px w-12 bg-gradient-to-r from-[#FF0000] to-transparent" />
        </div>
        
        <div className="space-y-3 flex-1 min-h-0 flex flex-col overflow-hidden">
          <p className="text-xs font-bold text-white uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
            {formatPrice(product.price)}
          </p>
          <p className="text-sm text-zinc-400 font-medium leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>

        <div className="mt-auto">
          <Link
            href="/menu"
            className="block w-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors border border-zinc-800 rounded-full hover:border-[#FF0000] text-center"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </NeonGradientCard>
  );
});
