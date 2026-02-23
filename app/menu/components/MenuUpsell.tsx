"use client";

import { MenuImage } from "@/components/ui/menu-image";
import type { Product } from "@/types";
import { resolvePrice, resolveDishImage } from "../utils";

interface Props {
  dishes: Product[];
  onNavigate: (id: string) => void;
}

export default function MenuUpsell({ dishes, onNavigate }: Props) {
  if (dishes.length === 0) return null;

  return (
    <section className="border-t border-zinc-800 pt-16 pb-10">
      <h3 className="text-primary text-2xl font-bold mb-8">Acompáñalo con</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {dishes.map((dish) => {
          const showPrice = resolvePrice(dish.price);
          return (
            <button
              key={dish.id}
              className="group cursor-pointer text-left"
              onClick={() => onNavigate(dish.id)}
            >
              <MenuImage
                src={resolveDishImage(dish)}
                alt={dish.name}
                containerClassName="w-full aspect-square rounded-2xl mb-4 shadow-xl"
                className="transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <h4 className="text-text-primary font-bold text-lg group-hover:text-primary transition-colors">
                {dish.name}
              </h4>
              <p className="text-text-secondary text-sm line-clamp-1 capitalize">
                {typeof dish.subcategory === "string"
                  ? dish.subcategory.replace(/-/g, " ")
                  : typeof dish.category === "string"
                  ? dish.category.replace(/-/g, " ")
                  : String(dish.category ?? "")}
              </p>
              <p className="text-primary font-bold mt-1">
                S./{showPrice.toFixed(2)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
