"use client";

import React from "react";
import type { Product } from "@/types";
import { ModalBody, ModalContent } from "@/components/ui/animated-modal";
import { resolveImage, resolveProductPrice } from "@/lib/admin/product-form";

type ProductDetailModalProps = {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  product: Product;
  categoryName?: string;
  subcategoryName?: string;
};

export default function ProductDetailModal({
  open,
  onClose,
  onEdit,
  product,
  categoryName,
  subcategoryName,
}: ProductDetailModalProps) {
  if (!open) return null;

  return (
    <ModalBody
      open={open}
      onClose={onClose}
      className="md:max-w-[60%] bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
    >
      <ModalContent className="p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black">Detalle del producto</h2>
          <button
            onClick={onEdit}
            className="rounded-full border border-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-500 hover:bg-blue-600/10"
          >
            Editar producto
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
          <div>
            <div
              className="h-64 rounded-3xl bg-cover bg-center mb-4"
              style={{ backgroundImage: `url(${resolveImage(product)})` }}
            />
            <p className="text-sm text-zinc-400 mb-2">{product.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { label: "Disponible", value: !!product.isAvailable },
                { label: "Chef Special", value: !!product.isChefSpecial },
                { label: "Recomendado", value: !!product.isRecommended },
                { label: "Vegetariano", value: !!product.isVegetarian },
                { label: "Picante", value: !!product.isSpicy },
                { label: "Sin Gluten", value: !!product.isGlutenFree },
              ].map((flag) => (
                <span
                  key={flag.label}
                  className={`px-3 py-1 rounded-full border font-black ${
                    flag.value
                      ? "bg-blue-600/20 border-blue-500 text-blue-400"
                      : "bg-white/5 border-zinc-800 text-zinc-500"
                  }`}
                >
                  {flag.label}
                </span>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase">Precio</p>
              <p className="font-black text-2xl text-blue-500">
                S./{resolveProductPrice(product.price).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase">Categoría</p>
              <p className="text-sm">{categoryName || product.category}</p>
              {product.subcategory && (
                <p className="text-xs text-zinc-500 uppercase mt-1">
                  {subcategoryName || product.subcategory}
                </p>
              )}
            </div>
            {product.ingredients?.length ? (
              <div>
                <p className="text-xs text-zinc-500 uppercase">Ingredientes</p>
                <p className="text-sm">{product.ingredients.join(", ")}</p>
              </div>
            ) : null}
            {product.allergens?.length ? (
              <div>
                <p className="text-xs text-zinc-500 uppercase">Alérgenos</p>
                <p className="text-sm">{product.allergens.join(", ")}</p>
              </div>
            ) : null}
            {product.gallery?.length ? (
              <div>
                <p className="text-xs text-zinc-500 uppercase">Galería</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {product.gallery.slice(0, 6).map((g) => (
                    <div
                      key={g}
                      className="h-16 w-full rounded-2xl bg-cover bg-center border border-zinc-800"
                      style={{ backgroundImage: `url(${g})` }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </ModalContent>
    </ModalBody>
  );
}
