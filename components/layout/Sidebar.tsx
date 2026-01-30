"use client";

import React from "react";
import { motion } from "framer-motion";
import { CATEGORY_ICONS } from "@/constants/categories";
import type { Category } from "@/types/domain";

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories?: Category[];
}

const Sidebar: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  const allCategories = [
    { id: "todo", name: "Todo el Menú", icon: "restaurant" },
    ...(categories ?? []).map((c) => ({
      ...c,
      icon: CATEGORY_ICONS[c.id] || "restaurant",
    })),
  ];

  return (
    <aside className="w-64 bg-background-dark border-r border-zinc-800 flex-col hidden md:flex shrink-0 transition-colors duration-300">
      <div className="p-6 space-y-10">
        {/* Menu Section */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-1">
              Menú
            </h3>
            <p className="text-text-secondary text-xs">
              Explorar por categoría
            </p>
          </div>

          <div className="flex flex-col gap-1 relative">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative z-10 group outline-none ${
                  selectedCategory === cat.id
                    ? "text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {selectedCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-primary/10 border-l-4 border-primary rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {selectedCategory !== cat.id && (
                  <div className="absolute inset-0 bg-surface-hover opacity-0 group-hover:opacity-100 rounded-xl transition-opacity -z-10" />
                )}

                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform relative z-20">
                  {cat.icon}
                </span>
                <span className="text-sm font-bold relative z-20">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Section */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-1">
              Dietética
            </h3>
            <p className="text-text-secondary text-xs">Filtros rápidos</p>
          </div>
          <div className="space-y-3">
            {["Vegetariano", "Vegano", "Sin Gluten"].map((label) => (
              <label
                key={label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-surface-dark border-zinc-700 rounded text-primary focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-text-secondary text-sm font-medium group-hover:text-text-primary transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="mt-auto p-6 border-t border-zinc-800">
        <div className="flex items-center gap-3 p-2 hover:bg-surface-hover rounded-xl transition-colors cursor-pointer">
          <div
            className="size-10 rounded-full bg-cover bg-center border border-zinc-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80')`,
            }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text-primary">
              Invitado
            </span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
              Registrarse
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
