"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useClickOutside } from "@/hooks/useClickOutside";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types/domain";

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Product[];
  isLoading: boolean;
}

const NavbarSearch: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  searchResults,
  isLoading,
}) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false),
  );

  const handleManualSearch = () => {
    if (searchTerm.trim()) {
      setShowDropdown(false);
      router.push(`/menu?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className="relative hidden md:flex items-center">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar platos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
          className="bg-surface-dark border border-zinc-700 rounded-xl px-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:border-primary outline-none transition-colors"
        />

        <AnimatePresence>
          {showDropdown && searchTerm.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full md:w-80 bg-surface-dark border border-zinc-700 rounded-xl shadow-lg z-50"
            >
              {isLoading ? (
                <div className="p-4 text-center text-text-secondary text-sm">
                  Buscando...
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto">
                  {searchResults.map((product, idx) => (
                    <li
                      key={product.id}
                      onClick={() => {
                        router.push(`/menu/${product.id}`);
                        setShowDropdown(false);
                      }}
                      className="p-3 hover:bg-surface-hover cursor-pointer border-b border-zinc-800 last:border-b-0 transition-colors"
                    >
                      <div className="text-sm font-medium text-text-primary">
                        {product.name}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {product.category}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-text-secondary text-sm">
                  No encontrado
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NavbarSearch;
