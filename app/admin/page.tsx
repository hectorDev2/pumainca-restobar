"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import {
  useCategories,
  useProducts,
  useCategorySubcategories,
  useCreateProduct,
  useUpdateProduct,
  useUploadProductImage,
} from "@/lib/queries";
import { useCreateCategory } from "@/lib/queries";
import CreateCategoryForm from "@/components/CreateCategoryForm";
import { AdminModal } from "@/components/ui/admin-modal";
import { Modal, ModalBody, ModalContent, ModalFooter } from "@/components/ui/animated-modal";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { Loader } from "@/components/ui/loader";

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  subcategoryName: string;
  isAvailable: boolean;
  isChefSpecial: boolean;
  isRecommended: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  isGlutenFree: boolean;
  isVariablePrice: boolean;
  preparationTimeMinutes: string;
  displayOrder: string;
};

const initialFormState: ProductFormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  subcategory: "",
  subcategoryName: "",
  isAvailable: true,
  isChefSpecial: false,
  isRecommended: false,
  isVegetarian: false,
  isSpicy: false,
  isGlutenFree: false,
  isVariablePrice: false,
  preparationTimeMinutes: "",
  displayOrder: "",
};

const booleanFlagOptions: Array<{
  label: string;
  field: keyof ProductFormState;
}> = [
  { label: "Disponible", field: "isAvailable" },
  { label: "Chef Special", field: "isChefSpecial" },
  { label: "Recomendado", field: "isRecommended" },
  { label: "Vegetariano", field: "isVegetarian" },
  { label: "Picante", field: "isSpicy" },
  { label: "Sin Gluten", field: "isGlutenFree" },
];

const parsePriceValue = (value?: number | string) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const resolveProductPrice = (
  price?: number | string | Record<string, number | string>
) => {
  if (typeof price === "number") return price;
  if (typeof price === "string") return parsePriceValue(price) ?? 0;
  if (price && typeof price === "object") {
    const values = Object.values(price)
      .map(parsePriceValue)
      .filter((v): v is number => typeof v === "number");
    return values.length > 0 ? Math.min(...values) : 0;
  }
  return 0;
};

const resolveImage = (product?: Product) =>
  product?.image_url || product?.gallery?.[0] || "/logo.png";

const buildProductFormState = (product: Product): ProductFormState => ({
  name: product.name,
  description: product.description ?? "",
  price: resolveProductPrice(product.price).toFixed(2),
  category: product.category ?? "",
  subcategory: product.subcategory ?? "",
  subcategoryName:
    (product as any).subcategory_name ?? (product as any).subcategoryName ?? "",
  isAvailable: !!product.isAvailable,
  isChefSpecial: !!product.isChefSpecial,
  isRecommended: !!product.isRecommended,
  isVegetarian: !!product.isVegetarian,
  isSpicy: !!product.isSpicy,
  isGlutenFree: !!product.isGlutenFree,
  isVariablePrice: !!(
    (product as any).is_variable_price ?? (product as any).isVariablePrice
  ),
  preparationTimeMinutes: String(
    (product as any).preparation_time_minutes ??
      (product as any).preparationTimeMinutes ??
      ""
  ),
  displayOrder: String(
    (product as any).display_order ?? (product as any).displayOrder ?? ""
  ),
});

export default function AdminPage() {
  const router = useRouter();
  // --- Queries ---
  const { data: products, isFetching } = useProducts({ sort: "recommended" });
  const { data: categories } = useCategories();

  // --- States ---
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editFormState, setEditFormState] = useState(initialFormState);
  const [editMainImage, setEditMainImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createFormState, setCreateFormState] = useState(initialFormState);
  const [createMainImage, setCreateMainImage] = useState<File | null>(null);
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(
    null
  );
  // --- Crear categoría ---
  const [isCreateCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [createCategoryName, setCreateCategoryName] = useState("");
  const [createCategoryDescription, setCreateCategoryDescription] =
    useState("");
  const [createCategoryImage, setCreateCategoryImage] = useState<File | null>(
    null
  );
  const [createCategoryPreview, setCreateCategoryPreview] = useState<
    string | null
  >(null);

  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalProduct, setDetailModalProduct] = useState<Product | null>(
    null
  );

  // --- Mutations ---
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const uploadImageMutation = useUploadProductImage();
  // createCategory handled inside CreateCategoryForm

  const isSaving =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    uploadImageMutation.isPending;

  // --- Memos & Effects ---
  const selectedProduct = useMemo(
    () =>
      products?.find((p) => p.id === selectedProductId) ??
      products?.[0] ??
      null,
    [products, selectedProductId]
  );

  const { data: createSubcategories } = useCategorySubcategories(
    createFormState.category || undefined
  );
  const { data: editSubcategories } = useCategorySubcategories(
    editFormState.category || undefined
  );
  const { data: detailModalSubcategories } = useCategorySubcategories(
    detailModalProduct?.category
  );

  useEffect(() => {
    if (createMainImage) {
      const url = URL.createObjectURL(createMainImage);
      setCreateImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setCreateImagePreview(null);
  }, [createMainImage]);

  useEffect(() => {
    if (createCategoryImage) {
      const url = URL.createObjectURL(createCategoryImage);
      setCreateCategoryPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setCreateCategoryPreview(null);
  }, [createCategoryImage]);

  useEffect(() => {
    if (editMainImage) {
      const url = URL.createObjectURL(editMainImage);
      setEditImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setEditImagePreview(null);
  }, [editMainImage]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, categoryFilter]);

  const categoriesMap = useMemo(
    () => new Map(categories?.map((c) => [c.id, c])),
    [categories]
  );

  // --- Handlers ---
  const openEditModal = (product: Product) => {
    setEditProductId(product.id);
    setEditFormState(buildProductFormState(product));
    setEditMainImage(null);
    // Mostrar la imagen actual del producto en la previsualización al abrir el modal
    setEditImagePreview(resolveImage(product));
    setEditModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("name", createFormState.name.trim());
    formPayload.append("description", createFormState.description.trim());
    if (createFormState.price)
      formPayload.append("price", createFormState.price);
    if (createFormState.category)
      formPayload.append("category_id", createFormState.category);
    if (createFormState.subcategory)
      formPayload.append("subcategory_id", createFormState.subcategory);
    if (createFormState.subcategoryName)
      formPayload.append("subcategory_name", createFormState.subcategoryName);

    formPayload.append(
      "is_variable_price",
      String(createFormState.isVariablePrice)
    );
    formPayload.append("is_available", String(createFormState.isAvailable));
    formPayload.append("is_vegetarian", String(createFormState.isVegetarian));
    formPayload.append("is_spicy", String(createFormState.isSpicy));
    formPayload.append("is_gluten_free", String(createFormState.isGlutenFree));
    formPayload.append(
      "is_chef_special",
      String(createFormState.isChefSpecial)
    );
    formPayload.append("is_recommended", String(createFormState.isRecommended));

    if (createFormState.preparationTimeMinutes)
      formPayload.append(
        "preparation_time_minutes",
        createFormState.preparationTimeMinutes
      );
    if (createFormState.displayOrder)
      formPayload.append("display_order", createFormState.displayOrder);

    if (createMainImage) formPayload.append("image", createMainImage);

    createProductMutation.mutate(formPayload, {
      onSuccess: () => {
        setCreateModalOpen(false);
        setCreateFormState(initialFormState);
        setCreateMainImage(null);
        try {
          router.refresh();
        } catch (err) {
          /* ignore */
        }
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductId) return;
    const formPayload = new FormData();
    formPayload.append("name", editFormState.name.trim());
    formPayload.append("description", editFormState.description.trim());
    if (editFormState.price) formPayload.append("price", editFormState.price);
    if (editFormState.category)
      formPayload.append("category_id", editFormState.category);
    if (editFormState.subcategory)
      formPayload.append("subcategory_id", editFormState.subcategory);
    if (editFormState.subcategoryName)
      formPayload.append("subcategory_name", editFormState.subcategoryName);

    formPayload.append(
      "is_variable_price",
      String(editFormState.isVariablePrice)
    );
    formPayload.append("is_available", String(editFormState.isAvailable));
    formPayload.append("is_vegetarian", String(editFormState.isVegetarian));
    formPayload.append("is_spicy", String(editFormState.isSpicy));
    formPayload.append("is_gluten_free", String(editFormState.isGlutenFree));
    formPayload.append("is_chef_special", String(editFormState.isChefSpecial));
    formPayload.append("is_recommended", String(editFormState.isRecommended));

    if (editFormState.preparationTimeMinutes)
      formPayload.append(
        "preparation_time_minutes",
        editFormState.preparationTimeMinutes
      );
    if (editFormState.displayOrder)
      formPayload.append("display_order", editFormState.displayOrder);

    // Adjuntamos la imagen al PUT si existe
    if (editMainImage) {
      formPayload.append("image", editMainImage);
    }

    updateProductMutation.mutate(
      { productId: editProductId, formData: formPayload },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          try {
            router.refresh();
          } catch (err) {
            /* ignore */
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AdminHeader />
      {isSaving && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-white animate-spin" />
            <p className="text-white font-bold">Guardando cambios...</p>
          </div>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <header>
          <h1 className="text-3xl font-black">Panel de Gestión</h1>
          <p className="text-zinc-400">
            Administra el catálogo y disponibilidad de productos.
          </p>
        </header>

        {/* Filtros y Acciones */}
        <div className="sticky top-20 z-40 bg-zinc-900/80 backdrop-blur-md p-4 md:p-6 rounded-3xl border border-zinc-800 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch">
            <select
              className="bg-black/40 border border-zinc-700 rounded-full px-4 py-2 text-sm w-full sm:w-auto min-w-0"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="search"
              placeholder="Buscar producto..."
              className="bg-black/40 border border-zinc-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full min-w-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-bold transition w-full md:w-auto"
            >
              Nuevo Producto
            </button>
            <button
              onClick={() => setCreateCategoryOpen(true)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm font-bold transition w-full md:w-auto"
            >
              Nueva Categoría
            </button>
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isFetching ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader text="Cargando catálogo..." />
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl hover:border-zinc-600 transition group"
              >
                <div className="flex gap-4">
                  <div
                    className="w-24 h-24 rounded-2xl bg-cover bg-center bg-zinc-800"
                    style={{ backgroundImage: `url(${resolveImage(product)})` }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-blue-500 font-black mt-1">
                      S./{resolveProductPrice(product.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-zinc-500 uppercase mt-1">
                      {categoriesMap.get(product.category)?.name ||
                        "Sin categoría"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      setDetailModalProduct(product);
                      setDetailModalOpen(true);
                    }}
                    className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-xs font-bold uppercase tracking-widest text-blue-500"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <ModalBody
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          className="md:max-w-[50%] bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
        >
          <ModalContent className="p-8 overflow-y-auto">
            <h2 className="text-2xl font-black mb-6">Editar Producto</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                    value={editFormState.name}
                    onChange={(e) =>
                      setEditFormState({
                        ...editFormState,
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
                    value={editFormState.price}
                    onChange={(e) =>
                      setEditFormState({
                        ...editFormState,
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
                    value={editFormState.category}
                    onChange={(e) =>
                      setEditFormState({
                        ...editFormState,
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
                    value={editFormState.subcategory}
                    onChange={(e) =>
                      setEditFormState({
                        ...editFormState,
                        subcategory: e.target.value,
                      })
                    }
                  >
                    <option value="">Sin subcategoría</option>
                    {editSubcategories?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Flags Booleanos */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {booleanFlagOptions.map((opt) => (
                  <label
                    key={opt.field}
                    className="flex items-center gap-2 p-3 bg-black/20 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-600"
                  >
                    <input
                      type="checkbox"
                      checked={editFormState[opt.field] as boolean}
                      onChange={(e) =>
                        setEditFormState({
                          ...editFormState,
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
              {/* Campos adicionales del DTO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Nombre subcategoría (opcional)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                    value={editFormState.subcategoryName}
                    onChange={(e) =>
                      setEditFormState({
                        ...editFormState,
                        subcategoryName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1 flex items-end gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editFormState.isVariablePrice}
                      onChange={(e) =>
                        setEditFormState({
                          ...editFormState,
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
                    value={editFormState.preparationTimeMinutes}
                    onChange={(e) =>
                      setEditFormState({
                        ...editFormState,
                        preparationTimeMinutes: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Orden de despliegue
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                    value={editFormState.displayOrder}
                    onChange={(e) =>
                      setEditFormState({
                        ...editFormState,
                        displayOrder: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Imagen principal */}
              <div className="grid gap-2">
                <label className="text-xs text-zinc-500 uppercase font-bold">
                  Imagen principal
                </label>
                <div className="h-40 w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black/20">
                  {editImagePreview ? (
                    <img
                      src={editImagePreview}
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
                  onChange={(files) => setEditMainImage(files[0] ?? null)}
                />
                {editMainImage && (
                  <p className="text-xs text-zinc-400">
                    Archivo: {editMainImage.name}
                  </p>
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
      )}

      {/* Modal Crear Producto */}
      {isCreateModalOpen && (
        <ModalBody
          open={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          className="md:max-w-[50%] bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
        >
          <ModalContent className="p-6 overflow-y-auto">
            <h2 className="text-2xl font-black mb-6">Nuevo Producto</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                    value={createFormState.name}
                    onChange={(e) =>
                      setCreateFormState({
                        ...createFormState,
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
                    value={createFormState.price}
                    onChange={(e) =>
                      setCreateFormState({
                        ...createFormState,
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
                    value={createFormState.category}
                    onChange={(e) =>
                      setCreateFormState({
                        ...createFormState,
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
                    value={createFormState.subcategory}
                    onChange={(e) =>
                      setCreateFormState({
                        ...createFormState,
                        subcategory: e.target.value,
                      })
                    }
                  >
                    <option value="">Sin subcategoría</option>
                    {createSubcategories?.map((s) => (
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
                    value={createFormState.subcategoryName}
                    onChange={(e) =>
                      setCreateFormState({
                        ...createFormState,
                        subcategoryName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={createFormState.isVariablePrice}
                      onChange={(e) =>
                        setCreateFormState({
                          ...createFormState,
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Tiempo preparación (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                    value={createFormState.preparationTimeMinutes}
                    onChange={(e) =>
                      setCreateFormState({
                        ...createFormState,
                        preparationTimeMinutes: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Orden de despliegue
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                    value={createFormState.displayOrder}
                    onChange={(e) =>
                      setCreateFormState({
                        ...createFormState,
                        displayOrder: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold">
                  Descripción
                </label>
                <textarea
                  className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                  rows={3}
                  value={createFormState.description}
                  onChange={(e) =>
                    setCreateFormState({
                      ...createFormState,
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
                  {createImagePreview ? (
                    <img
                      src={createImagePreview}
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
                  onChange={(files) => setCreateMainImage(files[0] ?? null)}
                />
                {createMainImage && (
                  <p className="text-xs text-zinc-400">
                    Archivo: {createMainImage.name}
                  </p>
                )}
              </div>

              <ModalFooter className="bg-transparent p-0 pt-4">
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={createProductMutation.isPending}
                    className="bg-blue-600 px-6 py-3 rounded-2xl font-bold disabled:opacity-50"
                  >
                    {createProductMutation.isPending
                      ? "Creando..."
                      : "Crear producto"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="text-zinc-400"
                  >
                    Cancelar
                  </button>
                </div>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalBody>
      )}

      {/* Modal Crear Categoría */}
      {isCreateCategoryOpen && (
        <ModalBody
          open={isCreateCategoryOpen}
          onClose={() => setCreateCategoryOpen(false)}
          className="md:max-w-[40%] bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
        >
          <ModalContent className="p-6">
            <h2 className="text-2xl font-black mb-4">Nueva Categoría</h2>
            <div className="space-y-4">
              <CreateCategoryForm
                onCreated={() => {
                  setCreateCategoryOpen(false);
                  setCreateCategoryName("");
                  setCreateCategoryDescription("");
                  setCreateCategoryImage(null);
                  try {
                    router.refresh();
                  } catch (err) {
                    /* ignore */
                  }
                }}
              />
              <ModalFooter className="bg-transparent p-0 pt-4">
                <button
                  type="button"
                  onClick={() => setCreateCategoryOpen(false)}
                  className="text-zinc-400"
                >
                  Cancelar
                </button>
              </ModalFooter>
            </div>
          </ModalContent>
        </ModalBody>
      )}

      {isDetailModalOpen && detailModalProduct && (
        <ModalBody
          open={isDetailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          className="md:max-w-[60%] bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
        >
          <ModalContent className="p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black">Detalle del producto</h2>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  openEditModal(detailModalProduct);
                }}
                className="rounded-full border border-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-500 hover:bg-blue-600/10"
              >
                Editar producto
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
              <div>
                <div
                  className="h-64 rounded-3xl bg-cover bg-center mb-4"
                  style={{
                    backgroundImage: `url(${resolveImage(detailModalProduct)})`,
                  }}
                />
                <p className="text-sm text-zinc-400 mb-2">
                  {detailModalProduct.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    {
                      label: "Disponible",
                      value: !!detailModalProduct.isAvailable,
                    },
                    {
                      label: "Chef Special",
                      value: !!detailModalProduct.isChefSpecial,
                    },
                    {
                      label: "Recomendado",
                      value: !!detailModalProduct.isRecommended,
                    },
                    {
                      label: "Vegetariano",
                      value: !!detailModalProduct.isVegetarian,
                    },
                    { label: "Picante", value: !!detailModalProduct.isSpicy },
                    {
                      label: "Sin Gluten",
                      value: !!detailModalProduct.isGlutenFree,
                    },
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
                    S./
                    {resolveProductPrice(detailModalProduct.price).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Categoría</p>
                  <p className="text-sm">
                    {categoriesMap.get(detailModalProduct.category)?.name ||
                      detailModalProduct.category}
                  </p>
                  {detailModalProduct.subcategory && (
                    <p className="text-xs text-zinc-500 uppercase mt-1">
                      {detailModalSubcategories?.find(
                        (s) => s.id === detailModalProduct.subcategory
                      )?.name || detailModalProduct.subcategory}
                    </p>
                  )}
                </div>
                {detailModalProduct.ingredients?.length ? (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase">
                      Ingredientes
                    </p>
                    <p className="text-sm">
                      {detailModalProduct.ingredients.join(", ")}
                    </p>
                  </div>
                ) : null}
                {detailModalProduct.allergens?.length ? (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase">Alérgenos</p>
                    <p className="text-sm">
                      {detailModalProduct.allergens.join(", ")}
                    </p>
                  </div>
                ) : null}
                {detailModalProduct.gallery?.length ? (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase">Galería</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {detailModalProduct.gallery.slice(0, 6).map((g) => (
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
      )}
    </div>
  );
}
