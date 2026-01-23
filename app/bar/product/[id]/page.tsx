"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useProduct, useProducts } from "@/lib/queries";
import { useCart } from "@/context/CartContext";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

const resolvePrice = (price?: number | Record<string, number>) => {
  if (typeof price === "number") {
    return price;
  }

  if (price && typeof price === "object") {
    const values = Object.values(price).filter(
      (value): value is number => typeof value === "number",
    );
    if (values.length > 0) {
      return Math.min(...values);
    }
  }

  return 0;
};

const formatPrice = (
  price: number | { [key: string]: number } | undefined,
): string => {
  if (!price) return "S./0.00";
  if (typeof price === "number") {
    return `S./${price.toFixed(2)}`;
  }
  const firstPrice = Object.values(price)[0];
  return `S./${firstPrice.toFixed(2)}`;
};

const calculateMolecularFormula = (ingredients: string[]): string => {
  if (!ingredients || ingredients.length === 0) return "C2H5OH";
  const first = ingredients[0]?.substring(0, 1).toUpperCase() || "C";
  const second = ingredients[1]?.substring(0, 1).toUpperCase() || "H";
  return `${first}2${second}5OH`;
};

const calculateIntensity = (drink: any): number => {
  const base = 30;
  const ingredientBonus = (drink.ingredients?.length || 0) * 5;
  const nameLength = drink.name?.length || 0;
  return Math.min(100, base + ingredientBonus + (nameLength % 20));
};

const generateFlavorProfile = (drink: any): string[] => {
  const profiles = [
    "Cítrico",
    "Dulce",
    "Amargo",
    "Ácido",
    "Picante",
    "Suave",
    "Intenso",
  ];
  const selected = new Set<string>();
  const name = drink.name?.toLowerCase() || "";

  if (name.includes("sour") || name.includes("limón")) selected.add("Cítrico");
  if (name.includes("sweet") || name.includes("dulce")) selected.add("Dulce");
  if (name.includes("bitter") || name.includes("amargo"))
    selected.add("Amargo");
  if (name.includes("spicy") || name.includes("picante"))
    selected.add("Picante");

  while (selected.size < 2 && selected.size < profiles.length) {
    const random = profiles[Math.floor(Math.random() * profiles.length)];
    selected.add(random);
  }

  return Array.from(selected);
};

export default function DrinkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const drinkId = params.id as string;

  const { data: drink, isLoading, error } = useProduct(drinkId);
  const { data: relatedDrinks } = useProducts({
    category: "bebidas",
    sort: "recommended",
  });

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (drink) {
      setActiveImage(drink.image || "");
      if (drink.price && typeof drink.price === "object") {
        const sizes = Object.keys(drink.price as Record<string, number>);
        setSelectedSize(sizes[0]);
      } else {
        setSelectedSize(undefined);
      }
    }
  }, [drink]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020204] text-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#ff2975] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm uppercase tracking-[0.3em]">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020204] text-white">
        <div className="text-center space-y-4">
          <p className="text-[#ff2975] text-xl font-bold">Error</p>
          <p className="text-zinc-400">No pudimos cargar la bebida.</p>
          <Link
            href="/bar"
            className="inline-block px-6 py-2 rounded-full border border-[#ff2975]/30 bg-[#ff2975]/10 text-[#ff2975] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#ff2975]/20 transition-colors"
          >
            Volver al Bar
          </Link>
        </div>
      </div>
    );
  }

  if (!drink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020204] text-white">
        <div className="text-center space-y-4">
          <p className="text-[#ff2975] text-xl font-bold">
            Bebida no encontrada
          </p>
          <Link
            href="/bar"
            className="inline-block px-6 py-2 rounded-full border border-[#ff2975]/30 bg-[#ff2975]/10 text-[#ff2975] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#ff2975]/20 transition-colors"
          >
            Volver al Bar
          </Link>
        </div>
      </div>
    );
  }

  const hasMultipleSizes =
    typeof drink.price === "object" && drink.price !== null;
  const priceRecord = hasMultipleSizes
    ? (drink.price as Record<string, number>)
    : undefined;
  const sizeOptions = priceRecord ? Object.keys(priceRecord) : [];

  const currentPrice = resolvePrice(
    hasMultipleSizes && selectedSize && priceRecord
      ? priceRecord[selectedSize]
      : typeof drink.price === "number"
        ? drink.price
        : undefined,
  );

  const gallery = drink.gallery || [];
  const allImages = drink.image ? [drink.image, ...gallery] : gallery;

  const relatedDrinksList = (relatedDrinks ?? [])
    .filter((related) => related.id !== drink.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(drink, quantity, { selectedSize });
  };

  const molecular = calculateMolecularFormula(drink.ingredients || []);
  const intensity = calculateIntensity(drink);
  const profile = generateFlavorProfile(drink);

  return (
    <div className="min-h-screen bg-[#020204] text-white selection:bg-[#ff2975] selection:text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff2975]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00FFF1]/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#ff2975]/20">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/bar" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              className="w-[100px] md:w-[120px] group-hover:scale-105 transition-transform"
              alt="Logo"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em]">
            <Link
              href="/bar"
              className="text-zinc-400 hover:text-[#ff2975] transition-colors"
            >
              Volver
            </Link>
            <Link
              href="/menu"
              className="text-zinc-400 hover:text-[#00FFF1] transition-colors"
            >
              Menú
            </Link>
            <div className="px-4 py-2 rounded-full border border-[#ff2975]/30 bg-[#ff2975]/10 text-[#ff2975] animate-pulse">
              Abierto
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex flex-wrap gap-2 py-4 mb-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            <Link href="/" className="hover:text-[#ff2975] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link
              href="/bar"
              className="hover:text-[#ff2975] transition-colors"
            >
              Bar
            </Link>
            <span>/</span>
            <span className="text-white">{drink.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Image Gallery */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <NeonGradientCard
                neonColor="#ff2975"
                secondaryColor="#00FFF1"
                className="w-full aspect-4/3"
                noInnerContainer
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  {activeImage && (
                    <Image
                      src={activeImage}
                      alt={drink.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  )}
                </div>
              </NeonGradientCard>

              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === img
                          ? "border-[#ff2975]"
                          : "border-transparent opacity-60 hover:opacity-100 border-zinc-800"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${drink.name} ${i + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <NeonGradientCard
                cardId="product-details"
                neonColor="#ff2975"
                secondaryColor="#00FFF1"
                className="min-h-[500px]"
                noInnerContainer
              >
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-[#ff2975] to-[#00FFF1] bg-clip-text text-transparent">
                      {drink.name}
                    </h1>
                    <div className="h-px w-24 bg-gradient-to-r from-[#ff2975] to-transparent" />
                  </div>

                  {/* Price */}
                  <div>
                    <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                      Precio
                    </div>
                    <div className="text-3xl font-black text-[#00FFF1] drop-shadow-[0_0_8px_rgba(0,255,241,0.5)]">
                      {formatPrice(drink.price)}
                    </div>
                  </div>

                  {/* Size Selection */}
                  {hasMultipleSizes && sizeOptions.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-3">
                        Tamaño
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {sizeOptions.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-[0.2em] transition-all ${
                              selectedSize === size
                                ? "border-[#ff2975] bg-[#ff2975]/20 text-[#ff2975]"
                                : "border-zinc-800 text-zinc-400 hover:border-[#00FFF1] hover:text-[#00FFF1]"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {drink.description && (
                    <div>
                      <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                        Descripción
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {drink.description}
                      </p>
                    </div>
                  )}

                  {/* Molecular Profile */}
                  <div className="pt-4 border-t border-zinc-800 space-y-4">
                    <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em]">
                      Molecular Formula
                    </div>
                    <div className="text-lg font-mono text-[#00FFF1] break-all">
                      {molecular}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-zinc-500 uppercase shrink-0">
                        Intensity
                      </div>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden min-w-0">
                        <div
                          className="h-full bg-gradient-to-r from-[#ff2975] to-[#00FFF1] transition-all duration-500"
                          style={{ width: `${intensity}%` }}
                        />
                      </div>
                      <div className="text-xs text-zinc-400 shrink-0">
                        {intensity}%
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {profile.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] rounded-full border border-[#ff2975]/30 bg-[#ff2975]/10 text-[#ff2975]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ingredients */}
                  {drink.ingredients && drink.ingredients.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-3">
                        Ingredientes
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {drink.ingredients.map((ingredient, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs text-zinc-400 border border-zinc-800 rounded-full"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity and Add to Cart */}
                  <div className="pt-4 border-t border-zinc-800 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em]">
                        Cantidad
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#ff2975] transition-colors flex items-center justify-center"
                        >
                          <span className="text-lg">−</span>
                        </button>
                        <span className="text-xl font-bold text-white w-12 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#00FFF1] transition-colors flex items-center justify-center"
                        >
                          <span className="text-lg">+</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="group/btn relative w-full px-8 py-4 rounded-full overflow-hidden transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ff2975] to-[#00FFF1] opacity-30 group-hover/btn:opacity-50 transition-opacity" />
                      <div className="absolute inset-px rounded-full bg-black z-0" />
                      <span className="relative z-10 text-sm font-black uppercase tracking-[0.3em] text-white">
                        Añadir al Carrito
                      </span>
                    </button>
                  </div>
                </div>
              </NeonGradientCard>
            </div>
          </div>

          {/* Related Drinks */}
          {relatedDrinksList.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 bg-gradient-to-r from-[#ff2975] to-[#00FFF1] bg-clip-text text-transparent">
                Bebidas Relacionadas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedDrinksList.map((relatedDrink) => (
                  <Link
                    key={relatedDrink.id}
                    href={`/bar/product/${relatedDrink.id}`}
                    className="group"
                  >
                    <NeonGradientCard
                      neonColor="#9b00ff"
                      secondaryColor="#ff2975"
                      className="h-[300px] cursor-pointer"
                      noInnerContainer
                    >
                      <div className="flex flex-col gap-4 h-full">
                        {relatedDrink.image && (
                          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#9b00ff]/20 shrink-0">
                            <Image
                              src={relatedDrink.image}
                              alt={relatedDrink.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <h3 className="text-lg font-black text-white group-hover:text-[#9b00ff] transition-colors">
                            {relatedDrink.name}
                          </h3>
                          <p className="text-xs font-bold text-[#00FFF1] uppercase tracking-[0.2em]">
                            {formatPrice(relatedDrink.price)}
                          </p>
                        </div>
                      </div>
                    </NeonGradientCard>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom HUD Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-[#00FFF1]/20">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.3em]">
            <div className="flex items-center gap-6 text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff2975] animate-pulse" />
                <span>Live</span>
              </div>
              <div>22:00 - 03:00</div>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/bar"
                className="text-zinc-400 hover:text-[#ff2975] transition-colors"
              >
                Bar
              </Link>
              <Link
                href="/menu"
                className="text-zinc-400 hover:text-[#00FFF1] transition-colors"
              >
                Menu
              </Link>
            </div>
            <div className="text-[#00FFF1]">Pumainca Bar</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
