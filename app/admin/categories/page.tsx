"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/lib/queries";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/animated-modal";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";

type CategoryFormState = {
  name: string;
  description: string;
};

const initialFormState: CategoryFormState = {
  name: "",
  description: "",
};

export default function CategoriesPage() {
  const router = useRouter();
  const { data: categories, isFetching } = useCategories();

  // Estados para crear categoría
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createFormState, setCreateFormState] = useState(initialFormState);
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(
    null,
  );

  // Estados para editar categoría
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editFormState, setEditFormState] = useState(initialFormState);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // Estados para eliminar
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  // Mutations
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const isSaving =
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending ||
    deleteCategoryMutation.isPending;

  // Handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", createFormState.name.trim());
    if (createFormState.description) {
      formData.append("description", createFormState.description.trim());
    }
    if (createImage) {
      formData.append("image", createImage);
    }

    createCategoryMutation.mutate(formData, {
      onSuccess: () => {
        setCreateModalOpen(false);
        setCreateFormState(initialFormState);
        setCreateImage(null);
        setCreateImagePreview(null);
        router.refresh();
      },
      onError: (error: any) => {
        alert(`Error: ${error.message}`);
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryId) return;

    const formData = new FormData();
    formData.append("name", editFormState.name.trim());
    if (editFormState.description) {
      formData.append("description", editFormState.description.trim());
    }
    if (editImage) {
      formData.append("image", editImage);
    }

    updateCategoryMutation.mutate(
      { categoryId: editCategoryId, formData },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setEditCategoryId(null);
          setEditFormState(initialFormState);
          setEditImage(null);
          setEditImagePreview(null);
          router.refresh();
        },
        onError: (error: any) => {
          alert(`Error: ${error.message}`);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return;

    deleteCategoryMutation.mutate(categoryToDelete.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        router.refresh();
      },
      onError: (error: any) => {
        alert(`Error: ${error.message}`);
      },
    });
  };

  const openEditModal = (category: Category) => {
    setEditCategoryId(category.id);
    setEditFormState({
      name: category.name,
      description: category.description || "",
    });
    setEditImage(null);
    setEditImagePreview(category.image || null);
    setEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  React.useEffect(() => {
    if (createImage) {
      const url = URL.createObjectURL(createImage);
      setCreateImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setCreateImagePreview(null);
  }, [createImage]);

  React.useEffect(() => {
    if (editImage) {
      const url = URL.createObjectURL(editImage);
      setEditImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [editImage]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AdminHeader />

      {isSaving && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-white animate-spin" />
            <p className="text-white font-bold">Guardando cambios...</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Gestión de Categorías</h1>
            <p className="text-zinc-400">Administra las categorías del menú</p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-bold uppercase tracking-widest"
          >
            + Nueva Categoría
          </button>
        </header>

        {/* Lista de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isFetching ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-blue-500 animate-spin" />
            </div>
          ) : categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-600 transition group"
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${category.image || "/logo.png"})`,
                  }}
                />
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-xl">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-zinc-400 mt-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                      onClick={() => openEditModal(category)}
                      className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openDeleteModal(category)}
                      className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-zinc-500">
              No hay categorías. Crea una para comenzar.
            </div>
          )}
        </div>
      </main>

      {/* Modal Crear Categoría */}
      {isCreateModalOpen && (
        <ModalBody
          open={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          className="md:max-w-xl bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
        >
          <ModalContent className="p-8">
            <h2 className="text-2xl font-black mb-6">Nueva Categoría</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold">
                  Nombre *
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
                  Descripción (opcional)
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
                  Imagen
                </label>
                <div className="h-48 w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black/20">
                  {createImagePreview ? (
                    <img
                      src={createImagePreview}
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
                  label="Seleccionar imagen"
                  description="Máx. 5MB, JPG/PNG"
                  accept="image/*"
                  onChange={(files) => setCreateImage(files[0] ?? null)}
                />
                {createImage && (
                  <p className="text-xs text-zinc-400">
                    Archivo: {createImage.name}
                  </p>
                )}
              </div>

              <ModalFooter className="bg-transparent p-0 pt-4">
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl font-bold uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    {isSaving ? "Creando..." : "Crear"}
                  </button>
                </div>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalBody>
      )}

      {/* Modal Editar Categoría */}
      {isEditModalOpen && (
        <ModalBody
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          className="md:max-w-xl bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
        >
          <ModalContent className="p-8">
            <h2 className="text-2xl font-black mb-6">Editar Categoría</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold">
                  Nombre *
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

              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold">
                  Descripción (opcional)
                </label>
                <textarea
                  className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-2"
                  rows={3}
                  value={editFormState.description}
                  onChange={(e) =>
                    setEditFormState({
                      ...editFormState,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-zinc-500 uppercase font-bold">
                  Imagen
                </label>
                <div className="h-48 w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black/20">
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
                  label="Cambiar imagen"
                  description="Máx. 5MB, JPG/PNG"
                  accept="image/*"
                  onChange={(files) => setEditImage(files[0] ?? null)}
                />
                {editImage && (
                  <p className="text-xs text-zinc-400">
                    Nuevo archivo: {editImage.name}
                  </p>
                )}
              </div>

              <ModalFooter className="bg-transparent p-0 pt-4">
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl font-bold uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    {isSaving ? "Guardando..." : "Actualizar"}
                  </button>
                </div>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalBody>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && categoryToDelete && (
        <ModalBody
          open={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          className="md:max-w-125 bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
        >
          <ModalContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-black mb-2">
                  ¿Eliminar categoría?
                </h2>
                <p className="text-zinc-400 mb-4">
                  Estás a punto de eliminar{" "}
                  <span className="font-bold text-white">
                    {categoryToDelete.name}
                  </span>
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-200">
                  <p className="font-bold mb-2">
                    ⚠️ Esta acción es irreversible
                  </p>
                  <ul className="text-left space-y-1 text-xs">
                    <li>• Se eliminará la categoría de la base de datos</li>
                    <li>• Se borrará la imagen asociada del servidor</li>
                    <li>• No se puede eliminar si tiene productos asociados</li>
                    <li>• No se podrá recuperar esta información</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 w-full pt-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleteCategoryMutation.isPending}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteCategoryMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
                >
                  {deleteCategoryMutation.isPending
                    ? "Eliminando..."
                    : "Eliminar"}
                </button>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      )}
    </div>
  );
}
