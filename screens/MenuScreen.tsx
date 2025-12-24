import React, { useState, useMemo } from 'react';
import { Screen, Product } from '../types';
import { products, categories, getSubcategories } from '../data';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onNavigate: (screen: Screen, dishId?: string) => void;
  cartCount: number;
  onAddToCart: (dish: Product) => void;
}

const MenuScreen: React.FC<Props> = ({ onNavigate, cartCount, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todo');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = categories.find(c => c.id === selectedCategory);
  const subcategories = selectedCategory !== 'todo' ? getSubcategories(selectedCategory) : null;

  // Reset subcategory when category changes
  React.useEffect(() => {
    setSelectedSubCategory(null);
  }, [selectedCategory]);

  const filteredDishes = useMemo(() => {
    return products.filter(dish => {
      const matchesCategory = selectedCategory === 'todo' || dish.category === selectedCategory;
      const matchesSubCategory = !selectedSubCategory || dish.subcategory === selectedSubCategory;
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSubCategory && matchesSearch;
    });
  }, [selectedCategory, selectedSubCategory, searchQuery]);

  // Helper to display price (handle number or object)
  const getDisplayPrice = (dish: Product) => {
    if (typeof dish.price === 'number') {
      return `S./${dish.price.toFixed(2)}`;
    }
    // If multiple prices, show "Desde $X" or smallest price
    const values = Object.values(dish.price);
    const minPrice = Math.min(...values);
    return `Desde S./${minPrice.toFixed(2)}`;
  };

  return (
    <div className="h-screen flex flex-col bg-background-dark overflow-hidden">
      <Navbar onNavigate={onNavigate} cartCount={cartCount} showSearch={false} activeScreen="menu" />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-dark scroll-smooth">
          <div className="max-w-[1200px] mx-auto space-y-10">
            
            {/* Search Bar for Mobile/Tablet */}
            <div className="md:hidden">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar plato..."
                  className="w-full bg-surface-dark border-none rounded-xl pl-12 py-3 text-white focus:ring-2 focus:ring-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Featured Section */}
            {selectedCategory === 'todo' && !searchQuery && products.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-2xl overflow-hidden relative shadow-2xl border border-zinc-800 group cursor-pointer"
                  onClick={() => onNavigate('dish-detail', products[0].id)}>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
                  <div className="h-[400px] bg-cover bg-center w-full transition-transform duration-700 group-hover:scale-105" 
                    style={{ backgroundImage: `url('${products[0].image}')` }}></div>
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 flex flex-col gap-4 max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm w-fit border border-primary/20">
                      <span className="material-symbols-outlined text-sm">stars</span> Especial del Chef
                    </span>
                    <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                      {products[0].name}
                    </h1>
                    <p className="text-gray-200 text-base md:text-lg font-medium leading-relaxed max-w-lg">
                      {products[0].description}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <button className="flex items-center gap-2 h-12 px-6 bg-primary hover:bg-red-500 text-white text-base font-bold rounded-lg transition-all shadow-lg shadow-red-500/20">
                        <span className="material-symbols-outlined">add</span>
                        Agregar al Pedido — {getDisplayPrice(products[0])}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Main Grid */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row items-end justify-between border-b border-zinc-800 pb-4 gap-4">
                <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                  <h2 className="text-primary text-2xl font-bold tracking-tight">
                    {activeCategory ? activeCategory.name : 'Todo el Menú'}
                  </h2>
                  <p className="text-text-secondary text-sm mt-1">
                    {activeCategory ? activeCategory.description : 'Explora nuestra carta completa'}
                  </p>
                </motion.div>

                {/* Subcategories (Tabs) */}
                {subcategories && subcategories.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
                    <button 
                      onClick={() => setSelectedSubCategory(null)}
                      className="relative px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors outline-none text-white"
                    >
                      {!selectedSubCategory && (
                        <motion.div 
                          layoutId="activeSubTab"
                          className="absolute inset-0 bg-white rounded-full"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className={`relative z-10 ${!selectedSubCategory ? 'text-black' : 'text-zinc-400 hover:text-white'}`}>Todos</span>
                    </button>
                    {subcategories.map(sub => (
                      <button 
                        key={sub.id}
                        onClick={() => setSelectedSubCategory(sub.id)}
                        className="relative px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors outline-none"
                      >
                         {selectedSubCategory === sub.id && (
                            <motion.div 
                              layoutId="activeSubTab"
                              className="absolute inset-0 bg-white rounded-full"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                        <span className={`relative z-10 ${selectedSubCategory === sub.id ? 'text-black' : 'text-zinc-400 hover:text-white'}`}>{sub.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {filteredDishes.length > 0 ? (
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
                      className="group relative flex flex-col bg-surface-dark rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-zinc-700"
                    >
                      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onNavigate('dish-detail', dish.id)}>
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                          style={{ backgroundImage: `url('${dish.image}')` }}></div>
                        {dish.isVegetarian && (
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-green-500">eco</span>
                          </div>
                        )}
                        {dish.isSpicy && (
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                             <span className="material-symbols-outlined text-[14px] text-orange-400">local_fire_department</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">{dish.name}</h3>
                          <span className="text-white font-bold text-sm bg-surface-hover px-2 py-1 rounded ml-2 whitespace-nowrap">{getDisplayPrice(dish)}</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
                          {dish.description}
                        </p>
                        <div className="mt-auto pt-4 border-t border-zinc-800 flex items-center justify-between">
                          <div className="flex gap-2 text-text-secondary">
                             {/* Icons can be added here */}
                          </div>
                          <button 
                            onClick={() => onNavigate('dish-detail', dish.id)} // Prefer detail view for adding to cart to select options if needed
                            className="text-sm font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
                            Ver Detalles <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </button>
                        </div>
                      </div>
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
                  <span className="material-symbols-outlined text-6xl text-zinc-700 mb-4">search_off</span>
                  <p className="text-zinc-500">No encontramos platos que coincidan con tu búsqueda.</p>
                </motion.div>
              )}
            </section>
          </div>
          
          <footer className="mt-20 border-t border-zinc-800 pt-8 pb-4 text-center">
            <p className="text-text-secondary text-sm">© 2024 Pumainca Restobar. Auténtica Cocina Andina.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MenuScreen;
