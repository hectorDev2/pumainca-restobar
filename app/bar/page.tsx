"use client";

import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import Link from "next/link";
import { memo, useState, useEffect } from "react";
import { useProducts } from "@/lib/queries";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";
import Image from "next/image";

// Bento Gallery Images
const barGalleryImages = [
  {
    src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=2000&q=80",
    alt: "Bar Atmosphere",
    span: [2, 2], // Large featured image
    title: "Ambiente Nocturno",
    subtitle: "Experiencia única",
  },
  {
    src: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80",
    alt: "Cocktail Preparation",
    span: [1, 1],
    title: "Mixología",
    subtitle: "Arte molecular",
  },
  {
    src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    alt: "Neon Cocktails",
    span: [1, 1],
    title: "Cócteles Neon",
    subtitle: "Brillan en la oscuridad",
  },
  {
    src: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80",
    alt: "Bar Counter",
    span: [1, 2],
    title: "Barra Principal",
    subtitle: "El corazón del bar",
  },
  {
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    alt: "Cocktail Glass",
    span: [1, 1],
    title: "Precisión",
    subtitle: "Cada detalle cuenta",
  },
  {
    src: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80",
    alt: "Bar Lighting",
    span: [1, 1],
    title: "Iluminación",
    subtitle: "Aura cyberpunk",
  },
  {
    src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    alt: "Night Scene",
    span: [1, 2],
    title: "Noches Épicas",
    subtitle: "22:00 - 03:00",
  },
];

// Helper function to calculate molecular formula based on ingredients
const calculateMolecularFormula = (ingredients: string[]): string => {
  if (!ingredients || ingredients.length === 0) return "C2H5OH";
  const formulas: Record<string, string> = {
    pisco: "C2H5OH",
    vodka: "C2H6O",
    ron: "C2H5OH",
    gin: "C2H6O",
    lima: "C6H8O7",
    limón: "C6H8O7",
    lychee: "C6H12O6",
    maracuyá: "C10H18O",
    pepino: "C3H6O",
    "agua tónica": "H2O + CO2",
  };

  const found = ingredients.find((ing) =>
    Object.keys(formulas).some((key) => ing.toLowerCase().includes(key)),
  );
  return found
    ? formulas[
        Object.keys(formulas).find((key) => found.toLowerCase().includes(key))!
      ] || "C2H5OH"
    : "C2H5OH";
};

// Helper function to calculate intensity based on product flags
const calculateIntensity = (product: Product): number => {
  let intensity = 50;
  if (product.isSpicy) intensity += 20;
  if (product.isChefSpecial) intensity += 15;
  if (product.isRecommended) intensity += 10;
  return Math.min(100, intensity);
};

// Helper function to generate flavor profile
const generateFlavorProfile = (product: Product): string[] => {
  const profile: string[] = [];
  if (product.isSpicy) profile.push("Picante");
  if (product.isVegetarian) profile.push("Vegetariano");
  if (product.isGlutenFree) profile.push("Sin Gluten");
  if (product.isChefSpecial) profile.push("Chef Special");
  if (product.isRecommended) profile.push("Recomendado");

  // Add based on ingredients
  const ingredients = product.ingredients || [];
  if (
    ingredients.some(
      (i) =>
        i.toLowerCase().includes("limón") || i.toLowerCase().includes("lima"),
    )
  ) {
    profile.push("Cítrico");
  }
  if (
    ingredients.some(
      (i) =>
        i.toLowerCase().includes("azúcar") || i.toLowerCase().includes("miel"),
    )
  ) {
    profile.push("Dulce");
  }
  if (
    ingredients.some(
      (i) =>
        i.toLowerCase().includes("menta") || i.toLowerCase().includes("hierba"),
    )
  ) {
    profile.push("Refrescante");
  }

  return profile.length > 0 ? profile : ["Clásico"];
};

// Helper function to format price
function formatPrice(
  price: number | { [key: string]: number } | undefined,
): string {
  if (!price) return "S./0.00";
  if (typeof price === "number") {
    return `S./${price.toFixed(2)}`;
  }
  const firstPrice = Object.values(price)[0];
  return `S./${firstPrice.toFixed(2)}`;
}

// Individual Drink Card Component with isolated hover state
const DrinkCard = memo(function DrinkCard({
  drink,
  onAddToCart,
}: {
  drink: Product;
  onAddToCart: (drink: Product) => void;
}) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const molecular = calculateMolecularFormula(drink.ingredients || []);
  const intensity = calculateIntensity(drink);
  const profile = generateFlavorProfile(drink);

  return (
    <NeonGradientCard
      neonColor="#ff2975"
      secondaryColor="#00FFF1"
      className="h-[450px] cursor-pointer"
      noInnerContainer
      onMouseEnter={() => {
        setIsCardHovered(true);
      }}
      onMouseLeave={() => {
        setIsCardHovered(false);
      }}
    >
      <div
        className="flex flex-col gap-4 w-full h-full overflow-hidden"
        style={{
          height: "100%",
          maxHeight: "100%",
          minHeight: "100%",
          width: "100%",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Drink Image - Clickable */}
        {drink.image_url && (
          <Link
            href={`/bar/product/${drink.id}`}
            className="relative w-full h-32 rounded-xl overflow-hidden border border-[#ff2975]/20 shrink-0 group/image cursor-pointer"
          >
            <Image
              src={drink.image_url}
              alt={drink.name}
              fill
              className="object-cover group-hover/image:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>
        )}

        <div className="space-y-2 shrink-0">
          <h3
            className={`text-2xl font-black tracking-tight transition-colors duration-300 ${isCardHovered ? "text-[#ff2975]" : "text-white"}`}
          >
            {drink.name}
          </h3>
          <div className="h-px w-12 bg-gradient-to-r from-[#ff2975] to-transparent" />
        </div>

        <div className="space-y-3 flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="shrink-0">
            <p className="text-xs font-bold text-[#00FFF1] uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(0,255,241,0.5)]">
              {formatPrice(drink.price)}
            </p>

            <p className="text-sm text-zinc-400 font-medium leading-relaxed line-clamp-2 mt-2">
              {drink.description}
            </p>
          </div>

          {/* Molecular Profile on Hover - Always rendered but hidden to prevent layout shift */}
          <div
            className="pt-4 border-t border-zinc-800 overflow-hidden shrink-0"
            style={{
              height: isCardHovered ? "auto" : "0px",
              maxHeight: isCardHovered ? "180px" : "0px",
              opacity: isCardHovered ? 1 : 0,
              transition:
                "opacity 0.3s ease, max-height 0.3s ease, height 0.3s ease",
              visibility: isCardHovered ? "visible" : "hidden",
            }}
          >
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#ff2975] uppercase tracking-[0.3em]">
                Molecular Formula
              </div>
              <div className="text-xs font-mono text-[#00FFF1] break-all">
                {molecular}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-zinc-500 uppercase shrink-0">
                  Intensity
                </div>
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden min-w-0">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff2975] to-[#00FFF1] transition-all duration-500"
                    style={{ width: `${intensity}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-400 shrink-0">
                  {intensity}%
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {profile.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-[#ff2975]/30 bg-[#ff2975]/10 text-[#ff2975]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-auto flex-wrap shrink-0">
          <button
            onClick={() => onAddToCart(drink)}
            className="group/btn relative px-6 py-2 rounded-full overflow-hidden transition-all duration-300 flex-1 min-w-[140px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff2975] to-[#00FFF1] opacity-20 group-hover/btn:opacity-40 transition-opacity" />
            <div className="absolute inset-px rounded-full bg-black z-0" />
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              Añadir
            </span>
          </button>

          <Link
            href={`/bar/product/${drink.id}`}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors border border-zinc-800 rounded-full hover:border-[#00FFF1] text-center"
          >
            Detalles
          </Link>
        </div>
      </div>
    </NeonGradientCard>
  );
});

export default function BarPage() {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  // Fetch drinks from backend
  const { data: drinks = [], isLoading } = useProducts({
    category: "bebidas",
    sort: "recommended",
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  // Handle keyboard navigation for gallery modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev + 1) % barGalleryImages.length : null,
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) =>
          prev !== null
            ? (prev - 1 + barGalleryImages.length) % barGalleryImages.length
            : null,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  return (
    <div className="min-h-screen bg-[#020204] text-white selection:bg-[#ff2975] selection:text-white overflow-x-hidden pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff2975]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00FFF1]/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#9b00ff]/5 rounded-full blur-[150px]" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#ff2975]/20">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              className="w-[100px] md:w-[120px] group-hover:scale-105 transition-transform"
              alt="Logo"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em]">
            <Link
              href="/menu"
              className="text-zinc-400 hover:text-[#ff2975] transition-colors"
            >
              Menú
            </Link>
            <Link
              href="/reservas"
              className="text-zinc-400 hover:text-[#00FFF1] transition-colors"
            >
              Reservas
            </Link>
            <Link
              href="/nosotros"
              className="text-zinc-400 hover:text-[#ff2975] transition-colors"
            >
              Nosotros
            </Link>
            <div className="px-4 py-2 rounded-full border border-[#ff2975]/30 bg-[#ff2975]/10 text-[#ff2975] animate-pulse">
              Abierto
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block px-4 py-1 rounded-full border border-[#ff2975]/30 bg-[#ff2975]/10 text-[#ff2975] text-[10px] uppercase tracking-[0.5em] font-bold animate-pulse">
              Exclusive Lounge
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-[#ff2975] to-[#00FFF1] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,41,117,0.5)]">
              NEON NIGHTS
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
              Sintetizamos sabores ancestrales con la vibrante energía de la
              noche. Cócteles diseñados para brillar en la oscuridad del
              Pumainca Bar.
            </p>
          </div>

          {/* Hero Image Background */}
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-20 border border-[#ff2975]/20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(2,2,4,0.7) 0%, rgba(2,2,4,0.9) 100%), url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=2000&q=80')`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,41,117,0.8)]">
                  EXPERIENCE THE VOID
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.5em] text-[#00FFF1]">
                  Where Molecules Meet Music
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drinks Section */}
      <section className="px-6 py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-[#ff2975] to-[#00FFF1] bg-clip-text text-transparent">
              MOLECULAR COCKTAILS
            </h2>
            <p className="text-zinc-400 text-sm uppercase tracking-[0.3em]">
              Crafted with Precision
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-[#ff2975] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : drinks.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              No hay bebidas disponibles en este momento
            </div>
          ) : (
            <div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
              style={{ isolation: "isolate" }}
            >
              {drinks.map((drink) => (
                <div
                  key={drink.id}
                  style={{
                    isolation: "isolate",
                    contain: "layout style paint",
                    width: "100%",
                    height: "450px",
                  }}
                >
                  <DrinkCard drink={drink} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bento Gallery Section */}
      <section className="px-6 py-20 border-t border-zinc-900">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-[#00FFF1] to-[#ff2975] bg-clip-text text-transparent">
              GALERÍA DEL BAR
            </h2>
            <p className="text-zinc-400 text-sm uppercase tracking-[0.3em]">
              Experiencia Visual Cyberpunk
            </p>
          </div>

          {/* Bento Grid Gallery */}
          <div
            className="bento-gallery grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-4"
            style={{
              gridAutoRows: "200px",
            }}
          >
            {barGalleryImages.map((item, index) => {
              const [rowSpan = 1, colSpan = 1] = item.span || [1, 1];
              const neonColor = index % 2 === 0 ? "#ff2975" : "#00FFF1";
              const secondaryColor = index % 2 === 0 ? "#00FFF1" : "#9b00ff";

              return (
                <div
                  key={index}
                  className="group relative cursor-pointer"
                  style={
                    {
                      gridRowEnd: `span ${rowSpan}`,
                      gridColumnEnd: `span ${colSpan}`,
                      "--border-size": "2px",
                      "--border-radius": "24px",
                      "--neon-color": neonColor,
                      "--secondary-color": secondaryColor,
                    } as React.CSSProperties
                  }
                  data-col-span={colSpan}
                >
                  {/* Neon Card Container */}
                  <div className="relative w-full h-full rounded-[var(--border-radius)] bg-zinc-950 p-1 overflow-hidden">
                    {/* Neon Glow Effect */}
                    <div
                      className="absolute inset-0 rounded-[var(--border-radius)]"
                      style={{
                        background: `linear-gradient(0deg, ${neonColor}, ${secondaryColor}, ${neonColor})`,
                        backgroundSize: "100% 200%",
                        animation: "neon-border 3s linear infinite",
                        opacity: 0.4,
                        transition: "opacity 0.5s ease",
                        pointerEvents: "none",
                        filter: "blur(20px)",
                        WebkitFilter: "blur(20px)",
                        zIndex: 0,
                      }}
                    />

                    {/* Neon Border */}
                    <div
                      className="absolute inset-0 rounded-[var(--border-radius)]"
                      style={{
                        background: `linear-gradient(0deg, ${neonColor}, ${secondaryColor}, ${neonColor})`,
                        backgroundSize: "100% 200%",
                        animation: "neon-border 3s linear infinite",
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    />

                    {/* Inner border container - This is the parent for all content */}
                    <div
                      className="absolute inset-[var(--border-size)] rounded-[calc(var(--border-radius)-var(--border-size))] bg-[#05030a]"
                      style={{
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    />

                    {/* Image Container - Directly inside border container */}
                    <div
                      className="absolute inset-[var(--border-size)] rounded-[calc(var(--border-radius)-var(--border-size))] overflow-hidden"
                      style={{
                        zIndex: 3,
                      }}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized
                      />
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content Overlay */}
                    <div
                      className="absolute inset-[var(--border-size)] flex flex-col justify-end z-30 p-6"
                      style={{
                        zIndex: 4,
                      }}
                    >
                      <div className="space-y-2">
                        <h3
                          className="text-xl md:text-2xl font-black text-white transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(255,41,117,1)]"
                          style={{
                            textShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}, 0 0 30px ${neonColor}`,
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] transition-all duration-500"
                          style={{
                            color: neonColor,
                            textShadow: `0 0 10px ${neonColor}`,
                          }}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {selectedImageIndex !== null && (
        <GalleryModal
          images={barGalleryImages}
          currentIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          onNext={() => {
            setSelectedImageIndex((prev) =>
              prev !== null ? (prev + 1) % barGalleryImages.length : null,
            );
          }}
          onPrevious={() => {
            setSelectedImageIndex((prev) =>
              prev !== null
                ? (prev - 1 + barGalleryImages.length) % barGalleryImages.length
                : null,
            );
          }}
        />
      )}

      {/* Reservation Panel */}
      <section className="px-6 py-20">
        <div className="max-w-[1400px] mx-auto">
          <NeonGradientCard
            neonColor="#9b00ff"
            secondaryColor="#ff2975"
            className="min-h-[300px]"
            noInnerContainer
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
              <div className="space-y-4 flex-1">
                <h3 className="text-3xl md:text-4xl font-black text-white">
                  Reserve Your Table
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                  Secure your spot in the void. Experience molecular mixology
                  and neural beats in an exclusive atmosphere.
                </p>
              </div>
              <Link
                href="/reservas"
                className="group/btn relative px-8 py-4 rounded-full overflow-hidden transition-all duration-300 min-w-[200px] text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#9b00ff] to-[#ff2975] opacity-30 group-hover/btn:opacity-50 transition-opacity" />
                <div className="absolute inset-px rounded-full bg-black z-0" />
                <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em] text-white">
                  Book Now
                </span>
              </Link>
            </div>
          </NeonGradientCard>
        </div>
      </section>

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
                href="/menu"
                className="text-zinc-400 hover:text-[#ff2975] transition-colors"
              >
                Menu
              </Link>
              <Link
                href="/reservas"
                className="text-zinc-400 hover:text-[#00FFF1] transition-colors"
              >
                Reservas
              </Link>
              <Link
                href="/nosotros"
                className="text-zinc-400 hover:text-[#ff2975] transition-colors"
              >
                About
              </Link>
            </div>
            <div className="text-[#00FFF1]">Pumainca Bar</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Gallery Modal Component
function GalleryModal({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: {
  images: typeof barGalleryImages;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const currentImage = images[currentIndex];
  const neonColor = currentIndex % 2 === 0 ? "#ff2975" : "#00FFF1";
  const secondaryColor = currentIndex % 2 === 0 ? "#00FFF1" : "#9b00ff";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Close modal"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 transition-all duration-300 hover:scale-110 group"
        aria-label="Previous image"
      >
        <svg
          className="w-6 h-6 text-white group-hover:text-[#00FFF1] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 transition-all duration-300 hover:scale-110 group"
        aria-label="Next image"
      >
        <svg
          className="w-6 h-6 text-white group-hover:text-[#ff2975] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Image Container */}
      <div
        className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          {/* Neon Border Effect */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(0deg, ${neonColor}, ${secondaryColor}, ${neonColor})`,
              backgroundSize: "100% 200%",
              animation: "neon-border 3s linear infinite",
              padding: "2px",
            }}
          >
            <div className="absolute inset-[2px] rounded-[calc(1.5rem-2px)] bg-[#05030a]" />
          </div>

          {/* Image */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-contain"
              sizes="90vw"
              unoptimized
              priority
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="max-w-4xl mx-auto">
              <h3
                className="text-3xl md:text-4xl font-black text-white mb-2"
                style={{
                  textShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}, 0 0 30px ${neonColor}`,
                }}
              >
                {currentImage.title}
              </h3>
              <p
                className="text-sm md:text-base font-medium uppercase tracking-[0.2em]"
                style={{
                  color: neonColor,
                  textShadow: `0 0 10px ${neonColor}`,
                }}
              >
                {currentImage.subtitle}
              </p>
              <div className="mt-4 text-xs text-zinc-400">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
