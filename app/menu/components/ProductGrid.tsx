"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "@/components/ui/loader";
import { MenuImage } from "@/components/ui/menu-image";
import { GlareCard } from "@/components/ui/glare-card";
import type { Product } from "@/types";
import { priceLabel, resolveDishImage } from "../utils";

interface Props {
  dishes: Product[];
  isLoading: boolean;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onAddToCart: (dish: Product) => void;
  onNavigate: (id: string) => void;
}

export default function ProductGrid({
  dishes,
  isLoading,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onNavigate,
}: Props) {
  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader text="Preparando el menú..." />
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20 text-center"
      >
        <span className="material-symbols-outlined text-6xl text-zinc-700 mb-4">
          search_off
        </span>
        <p className="text-zinc-500">
          No encontramos platos que coincidan con tu búsqueda.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {dishes.map((dish) => (
          <motion.div
            layout
            key={dish.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group relative h-full"
          >
            <GlareCard className="flex flex-col bg-surface-dark h-full min-h-[380px] sm:min-h-[440px] shadow-2xl">
              <div
                className="relative h-48 sm:h-56 md:h-64 overflow-hidden cursor-pointer shrink-0"
                onClick={() => onNavigate(dish.id)}
              >
                <MenuImage
                  src={resolveDishImage(dish)}
                  alt={dish.name}
                  containerClassName="absolute inset-0"
                  className="transition-transform duration-500 group-hover:scale-110"
                />

                <button
                  onClick={(e) => onToggleFavorite(e, dish.id)}
                  className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 md:p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-primary transition-all"
                >
                  <span
                    className={`material-symbols-outlined transition-colors ${
                      favorites.includes(dish.id) ? "text-primary" : "text-white"
                    }`}
                  >
                    {favorites.includes(dish.id) ? "favorite" : "favorite_border"}
                  </span>
                </button>

                {dish.isVegetarian && (
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-green-500">
                      eco
                    </span>
                  </div>
                )}
                {dish.isSpicy && (
                  <div className="absolute top-3 right-14 md:top-4 md:right-16 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-orange-400">
                      local_fire_department
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1 h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-text-primary text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                    {dish.name}
                  </h3>
                  <span className="text-text-primary font-bold text-sm bg-surface-hover px-2 py-1 rounded ml-2 whitespace-nowrap">
                    {priceLabel(dish)}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                  {dish.description}
                </p>
                <div className="mt-auto pt-4 border-t border-zinc-800 space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(dish);
                    }}
                    className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 flex-1 shadow-lg shadow-red-900/20 z-20 relative w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add_shopping_cart
                    </span>
                    Agregar
                  </button>
                  <button
                    onClick={() => onNavigate(dish.id)}
                    className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1 px-3 py-2 rounded-lg hover:bg-surface-hover z-20 relative w-full sm:w-auto text-center"
                  >
                    Detalles{" "}
                    <span className="material-symbols-outlined text-xs">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </GlareCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
