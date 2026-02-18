"use client";

import React from "react";
import type { Category } from "@/types";

type ProductFiltersBarProps = {
  categories?: Category[];
  categoryFilter: string;
  searchTerm: string;
  onCategoryFilterChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
  onCreateProduct: () => void;
  onCreateCategory: () => void;
};

export default function ProductFiltersBar({
  categories,
  categoryFilter,
  searchTerm,
  onCategoryFilterChange,
  onSearchTermChange,
  onCreateProduct,
  onCreateCategory,
}: ProductFiltersBarProps) {
  return (
    <div className="sticky top-20 z-40 bg-zinc-900/80 backdrop-blur-md p-4 md:p-6 rounded-3xl border border-zinc-800 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-2xl">
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch">
        <select
          className="bg-black/40 border border-zinc-700 rounded-full px-4 py-2 text-sm w-full sm:w-auto min-w-[180px] max-w-fit"
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Buscar producto..."
          className="bg-black/40 border border-zinc-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full min-w-0"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <button
          onClick={onCreateProduct}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-bold transition w-full md:w-auto"
        >
          Nuevo Producto
        </button>
        <button
          onClick={onCreateCategory}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm font-bold transition w-full md:w-auto"
        >
          Nueva Categoría
        </button>
      </div>
    </div>
  );
}
