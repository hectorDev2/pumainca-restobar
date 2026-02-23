"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Loader } from "@/components/ui/loader";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  useCategoryDetail,
  useCategorySubcategories,
  useCategories,
  useProducts,
} from "@/lib/queries";
import type { Product } from "@/types";
import type { SortOption } from "./utils";
import MenuHero from "./components/MenuHero";
import MenuSectionHeader from "./components/MenuSectionHeader";
import SubcategoryTabs from "./components/SubcategoryTabs";
import ProductGrid from "./components/ProductGrid";
import MenuUpsell from "./components/MenuUpsell";

function MenuContent() {
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>("todo");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortOrder, setSortOrder] = useState<SortOption>("recommended");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setSelectedSubCategory(null);
  }, [selectedCategory]);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null && query !== searchQuery) setSearchQuery(query);
  }, [searchParams]);

  const toggleFavorite = (e: React.MouseEvent, dishId: string) => {
    e.stopPropagation();
    const newFavs = favorites.includes(dishId)
      ? favorites.filter((id) => id !== dishId)
      : [...favorites, dishId];
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  const toggleDietaryFilter = (filter: string) => {
    setDietaryFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

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

  const activeCategory =
    selectedCategory === "todo"
      ? undefined
      : categoryDetail ?? categories?.find((c) => c.id === selectedCategory);

  const subcategories = categorySubcategories ?? activeCategory?.subcategories ?? [];

  const filteredDishes = useMemo<Product[]>(() => {
    if (!products) return [];
    let result = products;

    if (selectedSubCategory) {
      result = result.filter((dish) => dish.subcategory === selectedSubCategory);
    }

    if (dietaryFilters.length > 0) {
      result = result.filter((dish) => {
        if (dietaryFilters.includes("Vegetariano") && !dish.isVegetarian) return false;
        if (dietaryFilters.includes("Sin Gluten") && !dish.isGlutenFree) return false;
        if (dietaryFilters.includes("Vegano") && !dish.isVegetarian) return false;
        return true;
      });
    }

    return result;
  }, [products, selectedSubCategory, dietaryFilters]);

  const heroDish = filteredDishes[0];
  const upsellDishes = (products ?? []).filter((d) => d.id !== heroDish?.id).slice(0, 3);
  const navigateToDish = (id: string) => router.push(`/menu/${id}`);

  return (
    <div className="h-screen flex flex-col bg-background-dark overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          selectedDietaryFilters={dietaryFilters}
          onToggleDietaryFilter={toggleDietaryFilter}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-dark scroll-smooth transition-colors duration-300">
          <div className="max-w-[1200px] mx-auto space-y-10">
            {/* Búsqueda en mobile */}
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
              <MenuHero
                dish={heroDish}
                onAddToCart={addToCart}
                onNavigate={navigateToDish}
              />
            )}

            <section className="space-y-6">
              <MenuSectionHeader
                categoryName={activeCategory?.name ?? "Todo el Menú"}
                categoryDescription={
                  activeCategory?.description ?? "Explora nuestra carta completa"
                }
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                selectedCategory={selectedCategory}
              />

              <SubcategoryTabs
                subcategories={subcategories}
                selectedSubCategory={selectedSubCategory}
                onSelect={setSelectedSubCategory}
              />

              <ProductGrid
                dishes={filteredDishes}
                isLoading={isProductsFetching && !products}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
                onNavigate={navigateToDish}
              />
            </section>

            <MenuUpsell dishes={upsellDishes} onNavigate={navigateToDish} />
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
    <Suspense
      fallback={
        <div className="h-screen bg-black flex items-center justify-center">
          <Loader text="Cargando menú..." />
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
