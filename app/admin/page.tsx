"use client";

import React from "react";
import AdminHeader from "@/components/AdminHeader";
import { Loader } from "@/components/ui/loader";
import { useAdminPage } from "@/hooks/useAdminPage";
import ProductCard from "@/components/admin/ProductCard";
import ProductFiltersBar from "@/components/admin/ProductFiltersBar";
import CreateProductModal from "@/components/admin/CreateProductModal";
import EditProductModal from "@/components/admin/EditProductModal";
import ProductDetailModal from "@/components/admin/ProductDetailModal";
import DeleteProductModal from "@/components/admin/DeleteProductModal";
import CreateCategoryModal from "@/components/admin/CreateCategoryModal";

export default function AdminPage() {
  const {
    // Data
    categories,
    filteredProducts,
    categoriesMap,
    isFetching,
    isSaving,

    // Filters
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,

    // Create product
    isCreateModalOpen,
    setCreateModalOpen,
    createFormState,
    setCreateFormState,
    createMainImage,
    setCreateMainImage,
    createImagePreview,
    createSubcategories,
    handleCreateSubmit,

    // Edit product
    isEditModalOpen,
    setEditModalOpen,
    editFormState,
    setEditFormState,
    editMainImage,
    setEditMainImage,
    editImagePreview,
    editSubcategories,
    handleEditSubmit,
    openEditModal,

    // Detail
    isDetailModalOpen,
    setDetailModalOpen,
    detailModalProduct,
    detailSubcategoryName,
    openDetailModal,

    // Delete
    isDeleteModalOpen,
    setDeleteModalOpen,
    productToDelete,
    deleteProductMutation,
    handleDeleteConfirm,
    openDeleteModal,

    // Category
    isCreateCategoryOpen,
    setCreateCategoryOpen,
    handleCategoryCreated,
  } = useAdminPage();

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
        <header>
          <h1 className="text-3xl font-black">Panel de Gestión</h1>
          <p className="text-zinc-400">
            Administra el catálogo y disponibilidad de productos.
          </p>
        </header>

        <ProductFiltersBar
          categories={categories}
          categoryFilter={categoryFilter}
          searchTerm={searchTerm}
          onCategoryFilterChange={setCategoryFilter}
          onSearchTermChange={setSearchTerm}
          onCreateProduct={() => setCreateModalOpen(true)}
          onCreateCategory={() => setCreateCategoryOpen(true)}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isFetching ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader text="Cargando catálogo..." />
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoriesMap.get(product.category)?.name}
                onDetail={() => openDetailModal(product)}
                onEdit={() => openEditModal(product)}
                onDelete={() => openDeleteModal(product)}
              />
            ))
          )}
        </div>
      </main>

      <EditProductModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        formState={editFormState}
        setFormState={setEditFormState}
        categories={categories}
        subcategories={editSubcategories}
        imagePreview={editImagePreview}
        imageFile={editMainImage}
        onImageChange={setEditMainImage}
        isSaving={isSaving}
      />

      <CreateProductModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        formState={createFormState}
        setFormState={setCreateFormState}
        categories={categories}
        subcategories={createSubcategories}
        imagePreview={createImagePreview}
        imageFile={createMainImage}
        onImageChange={setCreateMainImage}
        isSaving={isSaving}
      />

      <CreateCategoryModal
        open={isCreateCategoryOpen}
        onClose={() => setCreateCategoryOpen(false)}
        onCreated={handleCategoryCreated}
      />

      {detailModalProduct && (
        <ProductDetailModal
          open={isDetailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onEdit={() => {
            setDetailModalOpen(false);
            openEditModal(detailModalProduct);
          }}
          product={detailModalProduct}
          categoryName={categoriesMap.get(detailModalProduct.category)?.name}
          subcategoryName={detailSubcategoryName}
        />
      )}

      <DeleteProductModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name}
        isPending={deleteProductMutation.isPending}
      />
    </div>
  );
}
