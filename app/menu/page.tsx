"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCategoryDetail,
  useCategorySubcategories,
  useCategories,
  useProducts,
} from "@/lib/queries";
import type { Product } from "@/types";
import { GlareCard } from "@/components/ui/glare-card";

type SortOption = "recommended" | "price_asc" | "price_desc" | "alphabetical";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Más recomendados" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "alphabetical", label: "Orden alfabético" },
];

function MenuContent() {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("todo");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortOrder, setSortOrder] = useState<SortOption>("recommended");

  const { data: categories } = useCategories();
  const { data: categoryDetail } = useCategoryDetail(
    selectedCategory !== "todo" ? selectedCategory : undefined
  );
  const { data: categorySubcategories } = useCategorySubcategories(
    selectedCategory !== "todo" ? selectedCategory : undefined
  );
  const { data: products, isFetching: isProductsFetching } = useProducts({
    category: selectedCategory === "todo" ? undefined : selectedCategory,
    search: searchQuery,
    sort: sortOrder,
  });

  useEffect(() => {
    setSelectedSubCategory(null);
  }, [selectedCategory]);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const activeCategory =
    selectedCategory === "todo"
      ? undefined
      : categoryDetail ??
        categories?.find((category) => category.id === selectedCategory);

  const subcategories =
    categorySubcategories ?? activeCategory?.subcategories ?? [];

  const filteredDishes = useMemo<Product[]>(() => {
    if (!products) {
      return [];
    }
    if (selectedSubCategory) {
      return products.filter(
        (dish) => dish.subcategory === selectedSubCategory
      );
    }
    return products;
  }, [products, selectedSubCategory]);

  const displayCategoryName = activeCategory?.name ?? "Todo el Menú";
  const displayCategoryDescription =
    activeCategory?.description ?? "Explora nuestra carta completa";

  const loadingProducts = isProductsFetching && !products;
  const heroDish = filteredDishes[0];

  const parsePriceValue = (value?: number | string): number | undefined => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const resolvePrice = (
    price?: number | string | Record<string, number | string>
  ) => {
    if (typeof price === "number") {
      return price;
    }

    if (price && typeof price === "object") {
      const values = Object.values(price)
        .map(parsePriceValue)
        .filter((value): value is number => typeof value === "number");
      if (values.length > 0) {
        return Math.min(...values);
      }
    }

    if (typeof price === "string") {
      const parsed = parsePriceValue(price);
      if (parsed !== undefined) {
        return parsed;
      }
    }

    return 0;
  };

  const resolveDishImage = (dish?: Product) =>
    dish?.image || dish?.image_url || dish?.gallery?.[0] || "";

  const priceLabel = (dish: any) => {
    const numericPrice = resolvePrice(dish?.price);
    if (numericPrice > 0) {
      return `S./${numericPrice.toFixed(2)}`;
    }
    return "S./0.00";
  };

  const upsellDishes = ((products ?? []) as Product[])
    .filter((dish) => dish.id !== heroDish?.id)
    .slice(0, 3);

  const navigateToDish = (id: string) => {
    router.push(`/menu/${id}`);
  };

  return (
    <div className="h-screen flex flex-col bg-background-dark overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-dark scroll-smooth transition-colors duration-300">
          <div className="max-w-[1200px] mx-auto space-y-10">
            <div className="md:hidden">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Buscar plato..."
                  className="w-full bg-surface-dark border-none rounded-xl pl-12 py-3 text-text-primary focus:ring-2 focus:ring-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {heroDish && selectedCategory === "todo" && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="rounded-2xl overflow-hidden relative shadow-2xl border border-zinc-800/50 group cursor-pointer"
                  onClick={() => navigateToDish(heroDish.id)}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-background-dark/90 via-background-dark/40 to-transparent z-10" />

                  <div
                    className="h-[400px] bg-cover bg-center w-full transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${resolveDishImage(heroDish)}')`,
                    }}
                  />
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 flex flex-col gap-4 max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm w-fit border border-primary/20">
                      <span className="material-symbols-outlined text-sm">
                        stars
                      </span>{" "}
                      Especial del Chef
                    </span>
                    <h1 className="text-text-primary text-4xl md:text-5xl font-black leading-tight tracking-tight shadow-md">
                      {heroDish.name}
                    </h1>
                    <p className="text-text-secondary text-base md:text-lg font-medium leading-relaxed max-w-lg drop-shadow-sm">
                      {heroDish.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(heroDish);
                        }}
                        className="flex items-center gap-2 h-12 px-6 bg-primary hover:bg-red-500 text-white text-base font-bold rounded-lg transition-all shadow-lg shadow-red-500/20"
                      >
                        <span className="material-symbols-outlined">add</span>
                        Agregar al Pedido — {priceLabel(heroDish)}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row items-end justify-between border-b border-zinc-800 pb-4 gap-4">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-primary text-2xl font-bold tracking-tight">
                    {displayCategoryName}
                  </h2>
                  <p className="text-text-secondary text-sm mt-1">
                    {displayCategoryDescription}
                  </p>
                </motion.div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Buscar plato..."
                      className="hidden md:block bg-surface-dark border-none rounded-full pl-10 pr-4 py-2 text-sm text-text-primary focus:ring-2 focus:ring-primary/50 placeholder-text-secondary/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-secondary">
                    <span className="text-text-primary text-[10px]">Ordenar por</span>
                    <select
                      value={sortOrder}
                      onChange={(event) =>
                        setSortOrder(event.target.value as SortOption)
                      }
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

              {subcategories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className="relative px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors outline-none text-text-primary"
                  >
                    {!selectedSubCategory && (
                      <motion.div
                        layoutId="activeSubTab"
                        className="absolute inset-0 bg-primary rounded-full alpha-100"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
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
                      onClick={() => setSelectedSubCategory(sub.id)}
                      className="relative px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors outline-none"
                    >
                      {selectedSubCategory === sub.id && (
                        <motion.div
                          layoutId="activeSubTab"
                          className="absolute inset-0 bg-primary rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
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
              )}

              {loadingProducts ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center text-text-primary"
                >
                  <span className="material-symbols-outlined text-6xl text-zinc-700 mb-4">
                    hourglass_top
                  </span>
                  <p className="text-zinc-500 text-sm">Cargando platos...</p>
                </motion.div>
              ) : filteredDishes.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredDishes.map((dish) => (
                      <motion.div
                        layout
                        key={dish.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="group relative h-full"
                      >
                        <GlareCard className="flex flex-col bg-surface-dark h-full">
                          <div
                            className="relative h-48 overflow-hidden cursor-pointer shrink-0"
                            onClick={() => navigateToDish(dish.id)}
                          >
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                              style={{
                                backgroundImage: `url('${resolveDishImage(
                                  dish
                                )}')`,
                              }}
                            />
                            {dish.isVegetarian && (
                              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-green-500">
                                  eco
                                </span>
                              </div>
                            )}
                            {dish.isSpicy && (
                              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-orange-400">
                                  local_fire_department
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-text-primary text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                                {dish.name}
                              </h3>
                              <span className="text-text-primary font-bold text-sm bg-surface-hover px-2 py-1 rounded ml-2 whitespace-nowrap">
                                {priceLabel(dish)}
                              </span>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
                              {dish.description}
                            </p>
                            <div className="mt-auto pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(dish);
                                }}
                                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 flex-1 shadow-lg shadow-red-900/20 z-20 relative"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  add_shopping_cart
                                </span>
                                Agregar
                              </button>
                              <button
                                onClick={() => navigateToDish(dish.id)}
                                className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1 px-3 py-2 rounded-lg hover:bg-surface-hover z-20 relative"
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
              ) : (
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
              )}
            </section>

            <section className="border-t border-zinc-800 pt-16 pb-10">
              <h3 className="text-primary text-2xl font-bold mb-8">
                Acompáñalo con
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {upsellDishes.map((dish) => {
                  const showPrice = resolvePrice(dish.price);
                  return (
                    <button
                      key={dish.id}
                      className="group cursor-pointer text-left"
                      onClick={() => navigateToDish(dish.id)}
                    >
                      <div
                        className="w-full aspect-square rounded-2xl bg-cover bg-center mb-4 transition-all group-hover:scale-[1.02] shadow-xl"
                        style={{
                          backgroundImage: `url('${resolveDishImage(dish)}')`,
                        }}
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
          </div>

          <footer className="mt-20 border-t border-zinc-800 pt-8 pb-4 text-center">
            <p className="text-text-secondary text-sm">
              © 2024 Pumainca Restobar. Auténtica Cocina Andina.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Cargando menú...</div>}>
      <MenuContent />
    </Suspense>
  );
}
