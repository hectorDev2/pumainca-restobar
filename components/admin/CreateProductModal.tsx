"use client";

import React from "react";
import type { Category, SubCategory } from "@/types";
import { ModalBody, ModalContent, ModalFooter } from "@/components/ui/animated-modal";
import { FileUpload } from "@/components/ui/file-upload";
import type { ProductFormState } from "@/lib/admin/product-form";

type CreateProductModalProps = {
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

export default function CreateProductModal({
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
}: CreateProductModalProps) {
  if (!open) return null;

  return (
    <ModalBody
      open={open}
      onClose={onClose}
      className="md:max-w-[50%] bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
    >
      <ModalContent className="p-6 overflow-y-auto">
        <h2 className="text-2xl font-black mb-6">Nuevo Producto</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            <div>
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
                className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                value={formState.category}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    category: e.target.value,
                  })
                }
                required
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
                className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            <div className="flex items-end">
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
          </div>

          <div>
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

          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold">
              Descripción
            </label>
            <textarea
              className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
              rows={3}
              value={formState.description}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-zinc-500 uppercase font-bold">
              Imagen principal (opcional)
            </label>
            <div className="h-40 w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black/20">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Previsualización"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-500">
                  Sin imagen
                </div>
              )}
            </div>
            <FileUpload
              label="Seleccionar imagen"
              description="Máx. 5MB, JPG/PNG"
              accept="image/*"
              onChange={(files) => onImageChange(files[0] ?? null)}
            />
            {imageFile && (
              <p className="text-xs text-zinc-400">Archivo: {imageFile.name}</p>
            )}
          </div>

          <ModalFooter className="bg-transparent p-0 pt-4">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 px-6 py-3 rounded-2xl font-bold disabled:opacity-50"
              >
                {isSaving ? "Creando..." : "Crear producto"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-zinc-400"
              >
                Cancelar
              </button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalBody>
  );
}
