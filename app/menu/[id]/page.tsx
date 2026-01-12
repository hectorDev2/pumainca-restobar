"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { products } from '@/data';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export default function DishDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  // Find dish from params
  const dishId = params.id as string;
  const dish = products.find(d => d.id === dishId);

  // State
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(dish?.image || '');
  const [cookingPoint, setCookingPoint] = useState('medium-rare');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  // Effects
  useEffect(() => {
    if (dish) {
      setActiveImage(dish.image);
      if (typeof dish.price !== 'number') {
        const sizes = Object.keys(dish.price);
        setSelectedSize(sizes[0]);
      } else {
        setSelectedSize(undefined);
      }
    }
  }, [dish]);

  // Handle Loading/Not Found
  if (!dish) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-background-dark">Plato no encontrado</div>;
  }

  // Derived state
  const hasMultipleSizes = typeof dish.price !== 'number';
  const sizeOptions = hasMultipleSizes ? Object.keys(dish.price as object) : [];
  
  const currentPrice = hasMultipleSizes && selectedSize
    ? (dish.price as any)[selectedSize]
    : (dish.price as number);

  const gallery = dish.gallery || [];
  const relatedDishes = products.filter(d => d.id !== dish.id && d.category === dish.category).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(dish, quantity, { cookingPoint, selectedSize });
    router.push('/menu');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 lg:px-10 py-6">
        <div className="flex flex-wrap gap-2 py-4 mb-4 text-sm font-medium text-text-secondary">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/menu" className="hover:text-primary transition-colors">Menú</Link>
          <span>/</span>
          <span className="text-white">{dish.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-20">
          {/* Left Column: Media */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
              <img src={activeImage} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <button className="absolute top-4 right-4 z-20 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-primary transition-all">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
            
            {(gallery.length > 0) && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {[dish.image, ...gallery].map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {dish.isChefSpecial && (
                <div className="bg-surface-dark p-4 rounded-xl border border-zinc-800 flex flex-col items-center text-center gap-2">
                  <span className="material-symbols-outlined text-primary text-3xl">stars</span>
                  <div>
                    <p className="text-white font-bold text-sm">Chef Special</p>
                    <p className="text-text-secondary text-xs">Recomendado</p>
                  </div>
                </div>
              )}
              {dish.isVegetarian && (
                <div className="bg-surface-dark p-4 rounded-xl border border-zinc-800 flex flex-col items-center text-center gap-2">
                  <span className="material-symbols-outlined text-primary text-3xl">eco</span>
                  <div>
                    <p className="text-white font-bold text-sm">Vegetariano</p>
                    <p className="text-text-secondary text-xs">Saludable</p>
                  </div>
                </div>
              )}
               {dish.isSpicy && (
                <div className="bg-surface-dark p-4 rounded-xl border border-zinc-800 flex flex-col items-center text-center gap-2">
                  <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
                  <div>
                    <p className="text-white font-bold text-sm">Picante</p>
                    <p className="text-text-secondary text-xs">Intenso</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Config */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="border-b border-zinc-800 pb-6">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-primary text-3xl lg:text-4xl font-black leading-tight tracking-tight">{dish.name}</h1>
                <span className="text-primary text-2xl lg:text-3xl font-bold">S./{currentPrice?.toFixed(2)}</span>
              </div>
              <p className="text-text-secondary text-lg mt-4 leading-relaxed">{dish.description}</p>
              
              {/* Ingredients */}
              {dish.ingredients && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {dish.ingredients.map((ing, i) => (
                    <span key={i} className="text-xs text-zinc-400 bg-zinc-900 px-2 py-1 rounded-md">{ing}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              
              {/* Size Selection */}
              {hasMultipleSizes && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-primary text-lg font-bold">Tamaño</h3>
                  <div className="flex flex-wrap gap-3">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-3 rounded-xl border font-bold capitalize transition-all ${selectedSize === size ? 'bg-primary text-white border-primary' : 'bg-surface-dark text-text-secondary border-zinc-800 hover:border-zinc-600'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cooking Point only for non-pizza/drinks might make sense, but for now filtering by category or checking if applicable */}
              {dish.category === 'platos-principales' && !dish.id.includes('pizza') && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-primary text-lg font-bold">Punto de Cocción</h3>
                    <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">Requerido</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Poco hecho', 'Medio hecho', 'Al punto', 'Bien cocido'].map((p) => (
                      <label key={p} className="cursor-pointer group">
                        <input 
                          type="radio" 
                          name="cooking" 
                          className="sr-only peer" 
                          checked={cookingPoint === p}
                          onChange={() => setCookingPoint(p)}
                        />
                        <div className="p-4 rounded-xl border border-zinc-800 bg-surface-dark/40 hover:bg-zinc-800 peer-checked:border-primary peer-checked:bg-primary/10 transition-all flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${cookingPoint === p ? 'border-primary bg-primary' : 'border-zinc-700'}`}></div>
                          <span className="text-white text-sm font-medium">{p}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <h3 className="text-primary text-lg font-bold">Instrucciones Especiales</h3>
                <textarea 
                  className="w-full bg-surface-dark border border-zinc-800 rounded-xl text-white p-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none min-h-[100px]"
                  placeholder="¿Alguna preferencia especial o alergia?"
                ></textarea>
              </div>
            </div>

            <div className="sticky bottom-4 mt-auto">
              <div className="bg-surface-dark/95 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center bg-black rounded-xl border border-zinc-800 p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white rounded-lg transition-colors">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-12 text-center text-white font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white rounded-lg transition-colors">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 w-full bg-primary hover:bg-red-500 text-white font-bold text-lg h-12 rounded-xl flex items-center justify-between px-6 transition-all shadow-lg shadow-primary/20">
                  <span>Añadir al Pedido</span>
                  <span>S./{(currentPrice && currentPrice * quantity).toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upsell Section */}
        <section className="border-t border-zinc-800 pt-16 pb-10">
          <h3 className="text-primary text-2xl font-bold mb-8">Acompáñalo con</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedDishes.map((d) => {
              // Calculate a price to show
              const showPrice = typeof d.price === 'number' ? d.price : Math.min(...Object.values(d.price));
              return (
                <div key={d.id} className="group cursor-pointer" onClick={() => router.push(`/menu/${d.id}`)}>
                  <div className="w-full aspect-square rounded-2xl bg-cover bg-center mb-4 transition-all group-hover:scale-[1.02] shadow-xl" 
                    style={{ backgroundImage: `url('${d.image}')` }}></div>
                  <h4 className="text-white font-bold text-lg group-hover:text-primary transition-colors">{d.name}</h4>
                  <p className="text-text-secondary text-sm line-clamp-1 capitalize">{d.category.replace(/-/g, ' ')}</p>
                  <p className="text-primary font-bold mt-1">S./{showPrice.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
