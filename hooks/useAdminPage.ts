"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCategories,
  useProducts,
  useCategorySubcategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/lib/queries";
import type { Product } from "@/types";
import {
  buildProductFormData,
  buildProductFormState,
  initialFormState,
  resolveImage,
  type ProductFormState,
} from "@/lib/admin/product-form";

export function useAdminPage() {
  const router = useRouter();

  // Queries
  const { data: products, isFetching } = useProducts({ sort: "recommended" });
  const { data: categories } = useCategories();

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Edit modal state
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editFormState, setEditFormState] = useState<ProductFormState>(initialFormState);
  const [editMainImage, setEditMainImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // Create product modal state
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createFormState, setCreateFormState] = useState<ProductFormState>(initialFormState);
  const [createMainImage, setCreateMainImage] = useState<File | null>(null);
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(null);

  // Create category modal state
  const [isCreateCategoryOpen, setCreateCategoryOpen] = useState(false);

  // Detail modal state
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalProduct, setDetailModalProduct] = useState<Product | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const isSaving =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    deleteProductMutation.isPending;

  // Subcategories per context
  const { data: createSubcategories } = useCategorySubcategories(
    createFormState.category || undefined,
  );
  const { data: editSubcategories } = useCategorySubcategories(
    editFormState.category || undefined,
  );
  const { data: detailModalSubcategories } = useCategorySubcategories(
    detailModalProduct?.category,
  );

  // Image previews
  useEffect(() => {
    if (!createMainImage) { setCreateImagePreview(null); return; }
    const url = URL.createObjectURL(createMainImage);
    setCreateImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [createMainImage]);

  useEffect(() => {
    if (!editMainImage) { setEditImagePreview(null); return; }
    const url = URL.createObjectURL(editMainImage);
    setEditImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [editMainImage]);

  // Derived data
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
    [categories],
  );

  const detailSubcategoryName = useMemo(
    () =>
      detailModalSubcategories?.find(
        (s) => s.id === detailModalProduct?.subcategory,
      )?.name,
    [detailModalSubcategories, detailModalProduct],
  );

  // Handlers
  const openEditModal = (product: Product) => {
    setEditProductId(product.id);
    setEditFormState(buildProductFormState(product));
    setEditMainImage(null);
    setEditImagePreview(resolveImage(product));
    setEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const openDetailModal = (product: Product) => {
    setDetailModalProduct(product);
    setDetailModalOpen(true);
  };

  const safeRefresh = () => {
    try { router.refresh(); } catch { /* ignore */ }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProductMutation.mutate(buildProductFormData(createFormState, createMainImage), {
      onSuccess: () => {
        setCreateModalOpen(false);
        setCreateFormState(initialFormState);
        setCreateMainImage(null);
        safeRefresh();
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductId) return;
    updateProductMutation.mutate(
      { productId: editProductId, formData: buildProductFormData(editFormState, editMainImage) },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          safeRefresh();
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
        safeRefresh();
      },
      onError: (error) => {
        alert(`Error al eliminar: ${error.message}`);
      },
    });
  };

  const handleCategoryCreated = () => {
    setCreateCategoryOpen(false);
    safeRefresh();
  };

  return {
    // Data
    products,
    categories,
    filteredProducts,
    categoriesMap,
    isFetching,
    isSaving,

    // Filter state
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

    // Detail modal
    isDetailModalOpen,
    setDetailModalOpen,
    detailModalProduct,
    detailSubcategoryName,
    openDetailModal,

    // Delete modal
    isDeleteModalOpen,
    setDeleteModalOpen,
    productToDelete,
    deleteProductMutation,
    handleDeleteConfirm,
    openDeleteModal,

    // Category modal
    isCreateCategoryOpen,
    setCreateCategoryOpen,
    handleCategoryCreated,
  };
}
