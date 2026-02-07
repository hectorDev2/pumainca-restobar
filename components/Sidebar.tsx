import React from "react";
import { motion } from "framer-motion";
import { Category } from "@/types";

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories?: Category[];
  selectedDietaryFilters: string[];
  onToggleDietaryFilter: (filter: string) => void;
}

const Sidebar: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  categories,
  selectedDietaryFilters,
  onToggleDietaryFilter,
}) => {
  // Map hardcoded icons to category IDs
  const getIcon = (id: string) => {
    switch (id) {
      case "platos-principales":
        return "dinner_dining";
      case "platos-vegetarianos":
        return "spa";
      case "pizzas":
        return "local_pizza";
      case "bebidas":
        return "local_bar";
      case "postres":
        return "icecream";
      default:
        return "restaurant";
    }
  };

  const allCategories = [
    { id: "todo", name: "Todo el Menú", icon: "restaurant" },
    ...(categories ?? []).map((c) => ({ ...c, icon: getIcon(c.id) })),
  ];

  return (
    <aside className="w-64 bg-earth-950 border-r border-earth-700/30 flex-col hidden md:flex shrink-0 transition-all duration-300">
      <div className="p-6 space-y-10">
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-ember-600 text-sm font-bold uppercase tracking-widest mb-1">
              Menú
            </h3>
            <p className="text-honey/70 text-xs">Explorar por categoría</p>
          </div>

          <div className="flex flex-col gap-1 relative">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative z-10 group outline-none ${selectedCategory === cat.id ? "text-ember-600" : "text-honey hover:text-cream"}`}
              >
                {selectedCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-ember-600/10 border-l-4 border-ember-600 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {selectedCategory !== cat.id && (
                  <div className="absolute inset-0 bg-earth-800/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity -z-10" />
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

        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-ember-600 text-sm font-bold uppercase tracking-widest mb-1">
              Dietética
            </h3>
            <p className="text-honey/70 text-xs">Filtros rápidos</p>
          </div>
          <div className="space-y-3">
            {["Vegetariano", "Vegano", "Sin Gluten"].map((label) => (
              <label
                key={label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-earth-900 border-earth-700/50 rounded text-ember-600 focus:ring-0 focus:ring-offset-0"
                  checked={selectedDietaryFilters.includes(label)}
                  onChange={() => onToggleDietaryFilter(label)}
                  aria-label={label}
                />
                <span
                  className={`text-sm font-medium group-hover:text-cream transition-colors ${selectedDietaryFilters.includes(label) ? "text-ember-600" : "text-honey"}`}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-earth-700/30">
        <div className="flex items-center gap-3 p-2 hover:bg-earth-800/40 rounded-xl transition-colors cursor-pointer">
          <div
            className="size-10 rounded-full bg-cover bg-center border border-earth-700/50"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80')`,
            }}
          ></div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-cream">Invitado</span>
            <span className="text-[10px] text-ember-600 font-bold uppercase tracking-wider">
              Registrarse
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
