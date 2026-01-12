"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { products } from '@/data';
import Navbar from '@/components/Navbar';
import { CartItem } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const { cart, cartTotal: totals, removeFromCart, updateQuantity, cartCount } = useCart();
  
  const upsellDishes = products.filter(d => !cart.some(item => item.dish.id === d.id)).slice(0, 3);

  const getItemPrice = (item: CartItem) => {
    if (typeof item.dish.price === 'number') return item.dish.price;
    if (item.selectedSize) return (item.dish.price as any)[item.selectedSize];
    return Math.min(...Object.values(item.dish.price as object));
  };

  const navigateToDish = (id: string) => {
    router.push(`/menu/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <Navbar />
      
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List of items */}
          <div className="lg:col-span-8 space-y-8">
            <div className="pb-6 border-b border-zinc-800">
              <h1 className="text-primary text-3xl sm:text-4xl font-black tracking-tight">Tu Pedido (Para Llevar)</h1>
              <p className="text-text-secondary mt-2">Revisa tus artículos antes de proceder al pago.</p>
            </div>

            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item, index) => {
                  const unitPrice = getItemPrice(item);
                  return (
                    <div key={index} className="flex flex-col sm:flex-row gap-6 bg-surface-dark rounded-2xl p-4 border border-zinc-800 hover:border-primary/40 transition-all group">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 shadow-lg" 
                          style={{ backgroundImage: `url('${item.dish.image}')` }}></div>
                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <h3 className="text-white group-hover:text-primary transition-colors text-lg font-bold mb-1">{item.dish.name}</h3>
                            <p className="text-text-secondary text-sm line-clamp-2">{item.dish.description}</p>
                            {item.selectedSize && (
                                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-zinc-800 text-xs font-bold text-white uppercase tracking-wider">{item.selectedSize}</span>
                            )}
                          </div>
                          <p className="text-primary font-bold text-lg mt-2">S./{unitPrice.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:border-l sm:border-zinc-800 sm:pl-6">
                        <div className="flex items-center gap-3 bg-black rounded-full p-1 border border-zinc-800">
                          <button 
                            onClick={() => updateQuantity(index, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-6 text-center text-white font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(index, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(index)}
                          className="text-text-secondary hover:text-primary text-sm font-medium flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Upsell */}
                <div className="mt-12 pt-8 border-t border-zinc-800">
                  <h3 className="text-primary text-xl font-bold mb-6">Completa tu comida</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {upsellDishes.map(d => {
                        const price = typeof d.price === 'number' ? d.price : Math.min(...Object.values(d.price));
                        return (
                          <div key={d.id} className="bg-surface-dark rounded-xl p-3 border border-zinc-800 hover:border-primary/50 transition-all cursor-pointer group" onClick={() => navigateToDish(d.id)}>
                            <div className="h-24 w-full bg-cover bg-center rounded-lg mb-3 shadow-inner" style={{ backgroundImage: `url('${d.image}')` }}></div>
                            <h4 className="text-white group-hover:text-primary transition-colors font-bold text-sm truncate">{d.name}</h4>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-primary text-sm font-bold">S./{price.toFixed(2)}</span>
                              <button className="w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span>
                              </button>
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center space-y-6">
                <span className="material-symbols-outlined text-6xl text-zinc-800">shopping_cart_off</span>
                <p className="text-zinc-500 text-lg">Tu carrito está vacío.</p>
                <Link href="/menu" className="bg-primary hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block">
                  Explorar Menú
                </Link>
              </div>
            )}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-primary text-xl font-bold mb-6">Resumen del Pedido</h2>
                <div className="space-y-4 mb-6 border-b border-zinc-800 pb-6">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">S./{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Impuestos (18% IGV)</span>
                    <span className="text-white font-medium">S./{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tarifa de Servicio</span>
                    <span className="text-white font-medium">S./{totals.serviceFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-8">
                  <span className="text-white font-bold text-lg">Total</span>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-primary">S./{totals.total.toFixed(2)}</span>
                    <span className="text-xs text-text-secondary">Incluye todas las tarifas</span>
                  </div>
                </div>

                <div className="relative mb-6">
                  <input type="text" placeholder="Código promocional" className="w-full bg-black border border-zinc-800 text-white rounded-xl py-3 px-4 pr-20 focus:ring-primary outline-none" />
                  <button className="absolute right-2 top-2 bottom-2 px-3 bg-zinc-800 text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors">APLICAR</button>
                </div>

                <Link 
                  href={cart.length === 0 ? '#' : '/checkout'}
                  aria-disabled={cart.length === 0}
                  className={`w-full bg-primary hover:bg-red-500 text-white font-bold text-lg rounded-xl py-4 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl shadow-primary/20 ${cart.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                  Proceder al Pago
                  <span className="material-symbols-outlined font-bold">arrow_forward</span>
                </Link>
              </div>
              
              <div className="flex justify-center gap-6 py-2 opacity-40">
                <span className="material-symbols-outlined" title="Pago Seguro">lock</span>
                <span className="material-symbols-outlined" title="Entrega Rápida">local_shipping</span>
                <span className="material-symbols-outlined" title="Calidad">verified</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
