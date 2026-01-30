"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import type { Category } from "@/types/domain";

interface Props {
  categories: readonly any[];
  onClose: () => void;
}

const MobileMenu: React.FC<Props> = ({ categories, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="md:hidden border-t border-zinc-900 bg-background-dark/95 backdrop-blur-md"
    >
      <div className="px-6 py-4 space-y-3">
        <Link
          href={ROUTES.MENU}
          onClick={onClose}
          className="block py-2 text-text-secondary hover:text-primary transition-colors"
        >
          Menú
        </Link>
        <Link
          href={ROUTES.RESERVAS}
          onClick={onClose}
          className="block py-2 text-text-secondary hover:text-primary transition-colors"
        >
          Reservas
        </Link>
        <Link
          href={ROUTES.NOSOTROS}
          onClick={onClose}
          className="block py-2 text-text-secondary hover:text-primary transition-colors"
        >
          Nosotros
        </Link>
        <Link
          href={ROUTES.CART}
          onClick={onClose}
          className="block py-2 text-text-secondary hover:text-primary transition-colors"
        >
          Carrito
        </Link>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
