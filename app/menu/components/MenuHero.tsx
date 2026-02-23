"use client";

import { motion } from "framer-motion";
import { MenuImage } from "@/components/ui/menu-image";
import type { Product } from "@/types";
import { priceLabel, resolveDishImage } from "../utils";

interface Props {
  dish: Product;
  onAddToCart: (dish: Product) => void;
  onNavigate: (id: string) => void;
}

export default function MenuHero({ dish, onAddToCart, onNavigate }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="rounded-2xl overflow-hidden relative shadow-2xl border border-zinc-800/50 group cursor-pointer"
        onClick={() => onNavigate(dish.id)}
      >
        <div className="absolute inset-0 bg-linear-to-r from-background-dark/90 via-background-dark/40 to-transparent z-10" />
        <MenuImage
          src={resolveDishImage(dish)}
          alt={dish.name}
          containerClassName="h-[400px] w-full"
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 flex flex-col gap-4 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm w-fit border border-primary/20">
            <span className="material-symbols-outlined text-sm">stars</span>
            Especial del Chef
          </span>
          <h1 className="text-text-primary text-4xl md:text-5xl font-black leading-tight tracking-tight shadow-md">
            {dish.name}
          </h1>
          <p className="text-text-secondary text-base md:text-lg font-medium leading-relaxed max-w-lg drop-shadow-sm">
            {dish.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(dish);
              }}
              className="flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-red-500 text-white text-base font-bold rounded-lg transition-all shadow-lg shadow-red-500/20 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined">add</span>
              Agregar al Pedido — {priceLabel(dish)}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
