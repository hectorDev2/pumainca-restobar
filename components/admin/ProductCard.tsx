import React from "react";
import type { Product } from "@/types";
import { resolveImage, resolveProductPrice } from "@/lib/admin/product-form";

type ProductCardProps = {
  product: Product;
  categoryName?: string;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductCard({
  product,
  categoryName,
  onDetail,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl hover:border-zinc-600 transition group">
      <div className="flex gap-4">
        <div
          className="w-24 h-24 rounded-2xl bg-cover bg-center bg-zinc-800"
          style={{ backgroundImage: `url(${resolveImage(product)})` }}
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
          <p className="text-blue-500 font-black mt-1">
            S./{resolveProductPrice(product.price).toFixed(2)}
          </p>
          <p className="text-xs text-zinc-500 uppercase mt-1">
            {categoryName || "Sin categoría"}
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-4 pt-4 border-t border-zinc-800">
        <button
          onClick={onDetail}
          className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
        >
          Detalles
        </button>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
