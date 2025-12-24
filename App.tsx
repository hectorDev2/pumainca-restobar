
import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Screen, CartItem, Product } from './types';
import { products } from './data';

import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import DishDetailScreen from './screens/DishDetailScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import AboutScreen from './screens/AboutScreen';
import ReservationScreen from './screens/ReservationScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Navigation handlers
  const navigateTo = (screen: Screen, dishId: string | null = null) => {
    setCurrentScreen(screen);
    if (dishId) setSelectedDishId(dishId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (dish: Product, quantity: number = 1, options: any = {}) => {
    setCart(prev => {
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
        // Fallback to min price if no size selected (shouldn't happen)
        price = Math.min(...Object.values(item.dish.price as object));
      }
      return acc + (price * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.18;
    const serviceFee = subtotal > 0 ? 2.00 : 0;
    return { subtotal, tax, serviceFee, total: subtotal + tax + serviceFee };
  }, [cart]);

  const selectedDish = useMemo(() => 
    products.find(d => d.id === selectedDishId) || products[0]
  , [selectedDishId]);


// ... (previous code)

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeScreen 
              onNavigate={navigateTo} 
              cartCount={cart.length}
            />
          </motion.div>
        )}
        {currentScreen === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MenuScreen 
              onNavigate={navigateTo} 
              cartCount={cart.length}
              onAddToCart={addToCart}
            />
          </motion.div>
        )}
        {currentScreen === 'dish-detail' && (
          <motion.div
            key="dish-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DishDetailScreen 
              dish={selectedDish}
              onNavigate={navigateTo} 
              cartCount={cart.length}
              onAddToCart={addToCart}
            />
          </motion.div>
        )}
        {currentScreen === 'cart' && (
          <motion.div
            key="cart"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CartScreen 
              cart={cart}
              totals={cartTotal}
              onNavigate={navigateTo} 
              onRemove={removeFromCart}
              onUpdateQty={updateQuantity}
            />
          </motion.div>
        )}
        {currentScreen === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckoutScreen 
              cart={cart}
              totals={cartTotal}
              onNavigate={navigateTo}
            />
          </motion.div>
        )}
        {currentScreen === 'nosotros' && (
           <motion.div
            key="nosotros"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AboutScreen 
              onNavigate={navigateTo}
              cartCount={cart.length}
            />
          </motion.div>
        )}
        {currentScreen === 'reservas' && (
           <motion.div
            key="reservas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ReservationScreen 
              onNavigate={navigateTo}
              cartCount={cart.length}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
