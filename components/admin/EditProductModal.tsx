"use client";

import React from "react";
import type { Category, SubCategory } from "@/types";
import { ModalBody, ModalContent, ModalFooter } from "@/components/ui/animated-modal";
import { FileUpload } from "@/components/ui/file-upload";
import type { ProductFormState } from "@/lib/admin/product-form";
import { booleanFlagOptions } from "@/lib/admin/product-form";

type EditProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formState: ProductFormState;
  setFormState: (state: ProductFormState) => void;
  categories?: Category[];
  subcategories?: SubCategory[];
  imagePreview: string | null;
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
  isSaving: boolean;
};

export default function EditProductModal({
  open,
  onClose,
  onSubmit,
  formState,
  setFormState,
  categories,
  subcategories,
  imagePreview,
  imageFile,
  onImageChange,
  isSaving,
}: EditProductModalProps) {
  if (!open) return null;

  return (
    <ModalBody
      open={open}
      onClose={onClose}
      className="md:max-w-[50%] bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
    >
      <ModalContent className="p-8 overflow-y-auto">
        <h2 className="text-2xl font-black mb-6">Editar Producto</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold">
                Nombre
              </label>
              <input
                type="text"
                required
                className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                value={formState.name}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold">
                Precio (S/.)
              </label>
              <input
                type="number"
                step="0.1"
                required
                className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                value={formState.price}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    price: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold">
                Categoría
              </label>
              <select
                className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2 mt-1"
                value={formState.category}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    category: e.target.value,
                    subcategory: "",
                  })
                }
              >
                <option value="">Seleccionar</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold">
                Subcategoría
              </label>
              <select
                className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2 mt-1"
                value={formState.subcategory}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    subcategory: e.target.value,
                  })
                }
              >
                <option value="">Sin subcategoría</option>
                {subcategories?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {booleanFlagOptions.map((opt) => (
              <label
                key={opt.field}
                className="flex items-center gap-2 p-3 bg-black/20 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-600"
              >
                <input
                  type="checkbox"
                  checked={formState[opt.field] as boolean}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      [opt.field]: e.target.checked,
                    })
                  }
                />
                <span className="text-xs font-bold uppercase">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold">
                Nombre subcategoría (opcional)
              </label>
              <input
                type="text"
                className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                value={formState.subcategoryName}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    subcategoryName: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1 flex items-end gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formState.isVariablePrice}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      isVariablePrice: e.target.checked,
                    })
                  }
                />
                <span className="text-xs font-bold uppercase">
                  Precio variable
                </span>
              </label>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold">
                Tiempo preparación (min)
              </label>
              <input
                type="number"
                min="0"
                className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                value={formState.preparationTimeMinutes}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    preparationTimeMinutes: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-zinc-500 uppercase font-bold">
              Imagen principal
            </label>
            <div className="h-40 w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black/20">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-500">
                  Sin imagen
                </div>
              )}
            </div>
            <FileUpload
              label="Añadir imagen"
              description="Arrastra o selecciona un archivo JPEG/PNG"
              accept="image/*"
              onChange={(files) => onImageChange(files[0] ?? null)}
            />
            {imageFile && (
              <p className="text-xs text-zinc-400">Archivo: {imageFile.name}</p>
            )}
          </div>
          <ModalFooter className="bg-transparent p-0 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-600 py-4 rounded-2xl font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {isSaving ? "Guardando..." : "Actualizar Producto"}
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalBody>
  );
}
