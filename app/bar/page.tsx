"use client";

import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import Link from "next/link";
import { useState } from "react";
import { useProducts, useProduct } from "@/lib/queries";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";
import Image from "next/image";
import { Modal, ModalBody, ModalContent, ModalFooter } from "@/components/ui/animated-modal";

const neuralSets = [
  { name: "Neural Set Alpha", time: "22:00", dj: "DJ Neon" },
  { name: "Neural Set Beta", time: "00:00", dj: "DJ Void" },
  { name: "Neural Set Gamma", time: "02:00", dj: "DJ Pulse" },
];

// Helper function to calculate molecular formula based on ingredients
const calculateMolecularFormula = (ingredients: string[]): string => {
  if (!ingredients || ingredients.length === 0) return "C2H5OH";
  const formulas: Record<string, string> = {
    "pisco": "C2H5OH",
    "vodka": "C2H6O",
    "ron": "C2H5OH",
    "gin": "C2H6O",
    "lima": "C6H8O7",
    "limón": "C6H8O7",
    "lychee": "C6H12O6",
    "maracuyá": "C10H18O",
    "pepino": "C3H6O",
    "agua tónica": "H2O + CO2",
  };
  
  const found = ingredients.find(ing => 
    Object.keys(formulas).some(key => ing.toLowerCase().includes(key))
  );
  return found ? formulas[Object.keys(formulas).find(key => found.toLowerCase().includes(key))!] || "C2H5OH" : "C2H5OH";
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
  if (ingredients.some(i => i.toLowerCase().includes("limón") || i.toLowerCase().includes("lima"))) {
    profile.push("Cítrico");
  }
  if (ingredients.some(i => i.toLowerCase().includes("azúcar") || i.toLowerCase().includes("miel"))) {
    profile.push("Dulce");
  }
  if (ingredients.some(i => i.toLowerCase().includes("menta") || i.toLowerCase().includes("hierba"))) {
    profile.push("Refrescante");
  }
  
  return profile.length > 0 ? profile : ["Clásico"];
};

export default function BarPage() {
  const [selectedDrinkId, setSelectedDrinkId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Fetch drinks from backend
  const { data: drinks = [], isLoading } = useProducts({
    category: "bebidas",
    sort: "recommended",
  });

  // Fetch selected drink details
  const { data: selectedDrink } = useProduct(selectedDrinkId || undefined);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const formatPrice = (price: number | { [key: string]: number } | undefined): string => {
    if (!price) return "S./0.00";
    if (typeof price === "number") {
      return `S./${price.toFixed(2)}`;
    }
    const firstPrice = Object.values(price)[0];
    return `S./${firstPrice.toFixed(2)}`;
  };

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
            <img src="/logo.png" className="w-[100px] md:w-[120px] group-hover:scale-105 transition-transform" alt="Logo" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em]">
            <Link href="/menu" className="text-zinc-400 hover:text-[#ff2975] transition-colors">
              Menú
            </Link>
            <Link href="/reservas" className="text-zinc-400 hover:text-[#00FFF1] transition-colors">
              Reservas
            </Link>
            <Link href="/nosotros" className="text-zinc-400 hover:text-[#ff2975] transition-colors">
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
              Sintetizamos sabores ancestrales con la vibrante energía de la noche. 
              Cócteles diseñados para brillar en la oscuridad del Pumainca Bar.
            </p>
          </div>

          {/* Hero Image Background */}
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-20 border border-[#ff2975]/20">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(2,2,4,0.7) 0%, rgba(2,2,4,0.9) 100%), url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=2000&q=80')`
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
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {drinks.map((drink) => {
                const molecular = calculateMolecularFormula(drink.ingredients || []);
                const intensity = calculateIntensity(drink);
                const profile = generateFlavorProfile(drink);
                const isHovered = hoveredCard === drink.id;

                return (
                  <NeonGradientCard 
                    key={drink.id}
                    neonColor="#ff2975"
                    secondaryColor="#00FFF1"
                    className="min-h-[450px] cursor-pointer"
                    onMouseEnter={() => setHoveredCard(drink.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex flex-col gap-4 w-full h-full">
                      {/* Drink Image */}
                      {drink.image && (
                        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#ff2975]/20">
                          <Image
                            src={drink.image}
                            alt={drink.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-[#ff2975] transition-colors duration-300">
                          {drink.name}
                        </h3>
                        <div className="h-px w-12 bg-gradient-to-r from-[#ff2975] to-transparent" />
                      </div>
                      
                      <div className="space-y-3 flex-1">
                        <p className="text-xs font-bold text-[#00FFF1] uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(0,255,241,0.5)]">
                          {formatPrice(drink.price)}
                        </p>
                        
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed line-clamp-2">
                          {drink.description}
                        </p>

                        {/* Molecular Profile on Hover */}
                        {isHovered && (
                          <div className="space-y-2 pt-4 border-t border-zinc-800 animate-fade-in">
                            <div className="text-[10px] font-bold text-[#ff2975] uppercase tracking-[0.3em]">
                              Molecular Formula
                            </div>
                            <div className="text-xs font-mono text-[#00FFF1]">
                              {molecular}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-[10px] text-zinc-500 uppercase">Intensity</div>
                              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#ff2975] to-[#00FFF1] transition-all duration-500"
                                  style={{ width: `${intensity}%` }}
                                />
                              </div>
                              <div className="text-[10px] text-zinc-400">{intensity}%</div>
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
                        )}
                      </div>

                      <div className="flex gap-3 mt-6 flex-wrap">
                        <button 
                          onClick={() => handleAddToCart(drink)}
                          className="group/btn relative px-6 py-2 rounded-full overflow-hidden transition-all duration-300 flex-1 min-w-[140px]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#ff2975] to-[#00FFF1] opacity-20 group-hover/btn:opacity-40 transition-opacity" />
                          <div className="absolute inset-px rounded-full bg-black z-0" />
                          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                            Añadir
                          </span>
                        </button>
                        
                        <button
                          onClick={() => setSelectedDrinkId(selectedDrinkId === drink.id ? null : drink.id)}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors border border-zinc-800 rounded-full hover:border-[#00FFF1]"
                        >
                          {selectedDrinkId === drink.id ? "Cerrar" : "Detalles"}
                        </button>
                      </div>
                    </div>
                  </NeonGradientCard>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Neural Sets / DJ Section */}
      <section className="px-6 py-20 border-t border-zinc-900">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-[#00FFF1] to-[#ff2975] bg-clip-text text-transparent">
              NEURAL SETS
            </h2>
            <p className="text-zinc-400 text-sm uppercase tracking-[0.3em]">
              Live Electronic Sessions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {neuralSets.map((set) => (
              <NeonGradientCard 
                key={set.name}
                neonColor="#00FFF1"
                secondaryColor="#9b00ff"
                className="min-h-[200px]"
              >
                <div className="flex flex-col gap-4 w-full">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#00FFF1] uppercase tracking-[0.3em]">
                      {set.time}
                    </div>
                    <h3 className="text-2xl font-black text-white">
                      {set.name}
                    </h3>
                    <div className="text-sm text-zinc-400 font-medium">
                      {set.dj}
                    </div>
                  </div>
                  <Link
                    href="/reservas"
                    className="mt-4 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white border border-[#00FFF1]/30 rounded-full hover:bg-[#00FFF1]/10 transition-colors text-center"
                  >
                    Reservar Mesa
                  </Link>
                </div>
              </NeonGradientCard>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Panel */}
      <section className="px-6 py-20">
        <div className="max-w-[1400px] mx-auto">
          <NeonGradientCard 
            neonColor="#9b00ff"
            secondaryColor="#ff2975"
            className="min-h-[300px]"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
              <div className="space-y-4 flex-1">
                <h3 className="text-3xl md:text-4xl font-black text-white">
                  Reserve Your Table
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                  Secure your spot in the void. Experience molecular mixology and neural beats in an exclusive atmosphere.
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
              <Link href="/menu" className="text-zinc-400 hover:text-[#ff2975] transition-colors">
                Menu
              </Link>
              <Link href="/reservas" className="text-zinc-400 hover:text-[#00FFF1] transition-colors">
                Reservas
              </Link>
              <Link href="/nosotros" className="text-zinc-400 hover:text-[#ff2975] transition-colors">
                About
              </Link>
            </div>
            <div className="text-[#00FFF1]">
              Pumainca Bar
            </div>
          </div>
        </div>
      </footer>

      {/* Drink Detail Modal */}
      {selectedDrink && (
        <ModalBody
          open={!!selectedDrink}
          onClose={() => setSelectedDrinkId(null)}
          className="md:max-w-[50%] bg-zinc-900 dark:bg-zinc-900 border-[#ff2975]/30"
        >
          <ModalContent className="p-8">
            <h3 className="text-3xl font-black text-white mb-6">
              {selectedDrink.name}
            </h3>
            
            <div className="space-y-6">
              {/* Image Gallery */}
              {(selectedDrink.image || (selectedDrink.gallery && selectedDrink.gallery.length > 0)) && (
                <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-[#ff2975]/20">
                  <Image
                    src={selectedDrink.image || selectedDrink.gallery?.[0] || ""}
                    alt={selectedDrink.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              )}

              {/* Price */}
              <div>
                <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                  Precio
                </div>
                <div className="text-2xl font-black text-[#00FFF1]">
                  {formatPrice(selectedDrink.price)}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                  Descripción
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  {selectedDrink.description}
                </p>
              </div>

              {/* Ingredients */}
              {selectedDrink.ingredients && selectedDrink.ingredients.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                    Ingredientes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDrink.ingredients.map((ingredient, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 text-xs font-medium rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Molecular Formula */}
              <div>
                <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                  Fórmula Molecular
                </div>
                <div className="text-lg font-mono text-[#00FFF1]">
                  {calculateMolecularFormula(selectedDrink.ingredients || [])}
                </div>
              </div>

              {/* Intensity */}
              <div>
                <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                  Intensidad
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#ff2975] to-[#00FFF1]"
                      style={{ width: `${calculateIntensity(selectedDrink)}%` }}
                    />
                  </div>
                  <div className="text-sm text-zinc-400">{calculateIntensity(selectedDrink)}%</div>
                </div>
              </div>

              {/* Flavor Profile */}
              <div>
                <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                  Perfil de Sabor
                </div>
                <div className="flex flex-wrap gap-2">
                  {generateFlavorProfile(selectedDrink).map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] rounded-full border border-[#ff2975]/30 bg-[#ff2975]/10 text-[#ff2975]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              {selectedDrink.allergens && selectedDrink.allergens.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                    Alérgenos
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDrink.allergens.map((allergen, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 text-xs font-medium rounded-full border border-red-500/30 bg-red-500/10 text-red-400"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preparation Time */}
              {selectedDrink.preparation_time_minutes && (
                <div>
                  <div className="text-xs font-bold text-[#ff2975] uppercase tracking-[0.3em] mb-2">
                    Tiempo de Preparación
                  </div>
                  <div className="text-sm text-zinc-300">
                    {selectedDrink.preparation_time_minutes} minutos
                  </div>
                </div>
              )}

            </div>

            <ModalFooter className="bg-transparent p-0 pt-4">
              <button 
                onClick={() => {
                  handleAddToCart(selectedDrink);
                  setSelectedDrinkId(null);
                }}
                className="group/btn relative px-8 py-3 rounded-full overflow-hidden transition-all duration-300 flex-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff2975] to-[#00FFF1] opacity-30 group-hover/btn:opacity-50 transition-opacity" />
                <div className="absolute inset-px rounded-full bg-black z-0" />
                <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em] text-white">
                  Añadir a Orden
                </span>
              </button>
            </ModalFooter>
          </ModalContent>
        </ModalBody>
      )}
    </div>
  );
}
