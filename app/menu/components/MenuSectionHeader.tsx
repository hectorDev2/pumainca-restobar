"use client";

import { motion } from "framer-motion";
import { sortOptions } from "../utils";
import type { SortOption } from "../utils";

interface Props {
  categoryName: string;
  categoryDescription: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortOrder: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedCategory: string;
}

export default function MenuSectionHeader({
  categoryName,
  categoryDescription,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  selectedCategory,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-zinc-800 pb-4 gap-4">
      <motion.div
        key={selectedCategory}
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full sm:w-auto"
      >
        <h2 className="text-primary text-2xl font-bold tracking-tight">
          {categoryName}
        </h2>
        <p className="text-text-secondary text-sm mt-1">{categoryDescription}</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar plato..."
            className="w-full sm:w-60 bg-surface-dark border-none rounded-full pl-10 pr-4 py-2 text-sm text-text-primary focus:ring-2 focus:ring-primary/50 placeholder-text-secondary/50"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs uppercase tracking-wide text-text-secondary">
          <span className="text-text-primary text-[10px]">Ordenar por</span>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-surface-dark border border-zinc-800 rounded-full px-4 py-2 text-[12px] text-text-primary outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
