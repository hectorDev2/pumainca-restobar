"use client";

import { useQuery } from "@tanstack/react-query";
import type { Category, Product, SubCategory } from "@/types";
import { apiFetch } from "@/lib/api";

export type ProductFilters = {
  category?: string;
  search?: string;
  sort?: string;
};

export const fetchCategories = () => apiFetch<Category[]>("/api/categories");

export const useCategories = () =>
  useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

export const fetchCategoryDetail = (categoryId: string) =>
  apiFetch<Category>(`/api/categories/${categoryId}`);

export const useCategoryDetail = (categoryId: string | undefined) =>
  useQuery<Category, Error>({
    queryKey: ["category", categoryId, "detail"],
    queryFn: () => fetchCategoryDetail(categoryId!),
    enabled: Boolean(categoryId),
  });

export const fetchCategorySubcategories = (categoryId: string) =>
  apiFetch<SubCategory[]>(`/api/categories/${categoryId}/subcategories`);

export const useCategorySubcategories = (categoryId: string | undefined) =>
  useQuery<SubCategory[], Error>({
    queryKey: ["category", categoryId, "subcategories"],
    queryFn: () => fetchCategorySubcategories(categoryId!),
    enabled: Boolean(categoryId),
  });

export const fetchProducts = (filters: ProductFilters) => {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  const query = params.toString();
  const path = query ? `/api/products?${query}` : "/api/products";
  return apiFetch<Product[]>(path);
};

export const useProducts = (filters: ProductFilters) =>
  useQuery<Product[], Error>({
    queryKey: [
      "products",
      filters.category ?? null,
      filters.search ?? "",
      filters.sort ?? "",
    ],
    queryFn: () => fetchProducts(filters),
  });

export const fetchProductById = (productId: string) =>
  apiFetch<Product>(`/api/products/${productId}`);

export const useProduct = (productId: string | undefined) =>
  useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId!),
    enabled: Boolean(productId),
  });
