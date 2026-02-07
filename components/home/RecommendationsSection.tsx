"use client";

import React from "react";
import { useProducts } from "@/lib/queries";
import Carousel3D from "@/components/ui/carousel-3d";
import { RecommendedCard } from "./RecommendedCard";

export function RecommendationsSection() {
  const { data: products = [] } = useProducts({ sort: "recommended" });

  const recommendedProducts = products.slice(0, 5);

  if (recommendedProducts.length === 0) return null;

  return (
    <section className="py-20 bg-[#020204] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-ember-600 to-ember-700 bg-clip-text text-transparent">
            RECOMENDADOS
          </h2>
          <p className="text-honey/70 text-sm uppercase tracking-[0.3em] font-bold">
            Favoritos de la Casa
          </p>
        </div>

        <div className="w-full relative">
          <Carousel3D
            items={recommendedProducts.map((product) => (
              <div className="w-full h-full p-4" key={product.id}>
                <RecommendedCard product={product} />
              </div>
            ))}
            itemWidth={320}
            curve={900}
          />
        </div>
      </div>

      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ember-600/5 rounded-full blur-[150px] pointer-events-none -z-0" />
    </section>
  );
}
