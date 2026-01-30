"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useNavbarSearch } from "@/hooks/useNavbarSearch";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import { ROUTES } from "@/constants/routes";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import NavbarSearch from "./NavbarSearch";
import NavbarMenu from "./NavbarMenu";
import MobileMenu from "./MobileMenu";

interface Props {
  showSearch?: boolean;
}

const Navbar: React.FC<Props> = ({ showSearch = true }) => {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { searchTerm, setSearchTerm, searchResults, isLoading } =
    useNavbarSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path
      ? "text-primary transition-colors text-sm font-bold border-b-2 border-primary pb-0.5"
      : "text-text-secondary hover:text-primary transition-colors text-sm font-semibold";
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-background-dark/95 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex-shrink-0">
          <NextImage
            src="/logo.png"
            width={100}
            height={40}
            alt="Logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <NavbarMenu isActive={isActive} />

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {showSearch && (
            <NavbarSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchResults={searchResults}
              isLoading={isLoading}
            />
          )}

          <Link href={ROUTES.CART} className="relative hidden md:flex">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <AnimatedThemeToggler />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            categories={PRODUCT_CATEGORIES}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
