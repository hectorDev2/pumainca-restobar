"use client";

import { motion } from "framer-motion";
import type { SubCategory } from "@/types";

interface Props {
  subcategories: SubCategory[];
  selectedSubCategory: string | null;
  onSelect: (id: string | null) => void;
}

export default function SubcategoryTabs({
  subcategories,
  selectedSubCategory,
  onSelect,
}: Props) {
  if (subcategories.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className="relative px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors outline-none text-text-primary"
      >
        {!selectedSubCategory && (
          <motion.div
            layoutId="activeSubTab"
            className="absolute inset-0 bg-primary rounded-full alpha-100"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span
          className={`relative z-10 ${
            !selectedSubCategory
              ? "text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Todos
        </span>
      </button>

      {subcategories.map((sub) => (
        <button
          key={sub.id}
          onClick={() => onSelect(sub.id)}
          className="relative px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors outline-none"
        >
          {selectedSubCategory === sub.id && (
            <motion.div
              layoutId="activeSubTab"
              className="absolute inset-0 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 ${
              selectedSubCategory === sub.id
                ? "text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {sub.name}
          </span>
        </button>
      ))}
    </div>
  );
}
