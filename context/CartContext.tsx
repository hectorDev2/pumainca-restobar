"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, CartItem } from '@/types'; // Need to update types import path or alias

// We might need to duplicate types here if they aren't easily shareable due to module resolution, 
// but using @/types should work if tsconfig paths are set.

interface CartContextType {
  cart: CartItem[];
  addToCart: (dish: Product, quantity?: number, options?: any) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  cartTotal: {
    subtotal: number;
    tax: number;
    serviceFee: number;
    total: number;
  };
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (dish: Product, quantity: number = 1, options: any = {}) => {
    setCart(prev => {
      // Logic for adding to cart
       return [...prev, { 
        dish, 
        quantity, 
        selectedSize: options.selectedSize,
        options 
      }];
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const newQty = Math.max(1, newCart[index].quantity + delta);
      newCart[index] = { ...newCart[index], quantity: newQty };
      return newCart;
    });
  };

  const cartTotal = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => {
      let price = 0;
      if (typeof item.dish.price === 'number') {
        price = item.dish.price;
      } else if (item.selectedSize) {
        price = (item.dish.price as any)[item.selectedSize];
      } else {
        price = Math.min(...Object.values(item.dish.price as object));
      }
      return acc + (price * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.18;
    const serviceFee = subtotal > 0 ? 2.00 : 0;
    return { subtotal, tax, serviceFee, total: subtotal + tax + serviceFee };
  }, [cart]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartTotal,
      cartCount: cart.length 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
