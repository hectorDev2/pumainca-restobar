"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, Product, SubCategory } from "@/types";
import { apiFetch } from "@/lib/api";

export type ProductFilters = {
  category?: string;
  search?: string;
  sort?: string;
};

type BackendProductPrice = {
  size_name: string;
  price: number | string;
};

type BackendImageEntry = {
  id?: number;
  productId?: string;
  imageUrl?: string;
  displayOrder?: number;
};

type BackendIngredientEntry = {
  id?: number;
  productId?: string;
  ingredient?: string;
};

type BackendCategoryReference = {
  id?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
};

type BackendProduct = {
  id: string;
  name: string;
  description: string;
  category_id?: string;
  categoryId?: string;
  category?: BackendCategoryReference;
  subcategory_id?: string | null;
  subcategoryId?: string | null;
  image_url?: string;
  imageUrl?: string;
  image?: string | BackendImageEntry | null;
  price?: number | string | null;
  is_variable_price?: boolean;
  isVariablePrice?: boolean;
  is_available?: boolean;
  isAvailable?: boolean;
  is_vegetarian?: boolean;
  isVegetarian?: boolean;
  is_spicy?: boolean;
  isSpicy?: boolean;
  is_gluten_free?: boolean;
  isGlutenFree?: boolean;
  is_chef_special?: boolean;
  isChefSpecial?: boolean;
  is_recommended?: boolean;
  isRecommended?: boolean;
  ingredients?: (string | BackendIngredientEntry)[];
  allergens?: string[];
  gallery?: (string | BackendImageEntry)[];
  prices?: BackendProductPrice[];
};

const parseNumberValue = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const buildPriceRecord = (
  prices?: BackendProductPrice[]
): Record<string, number> | undefined => {
  if (!prices || prices.length === 0) {
    return undefined;
  }

  const record: Record<string, number> = {};
  for (const entry of prices) {
    if (!entry?.size_name) continue;
    const parsed = parseNumberValue(entry.price);
    if (parsed === undefined) continue;
    record[entry.size_name] = parsed;
  }

  return Object.keys(record).length > 0 ? record : undefined;
};

const coalesce = <T>(...values: Array<T | undefined | null>): T | undefined =>
  values.find((value): value is T => value !== undefined && value !== null);

const normalizeProduct = (backend: BackendProduct): Product => {
  const priceRecord = buildPriceRecord(backend.prices);
  const fallbackPrice = parseNumberValue(backend.price) ?? 0;
  const price =
    backend.is_variable_price && priceRecord ? priceRecord : fallbackPrice;

  const normalizeImageEntry = (
    entry?: string | BackendImageEntry | null
  ): string | undefined => {
    if (!entry) return undefined;
    return typeof entry === "string" ? entry : entry.imageUrl;
  };

  const normalizeGallery = (
    gallery?: (string | BackendImageEntry)[]
  ): string[] => {
    if (!gallery) return [];
    return gallery
      .map((item) => normalizeImageEntry(item))
      .filter((src): src is string => Boolean(src));
  };

  const normalizeIngredients = (
    ingredients?: (string | BackendIngredientEntry)[]
  ): string[] => {
    if (!ingredients) return [];
    return ingredients
      .map((item) =>
        typeof item === "string" ? item : item.ingredient ?? undefined
      )
      .filter((ing): ing is string => Boolean(ing));
  };

  const galleryImages = normalizeGallery(backend.gallery);
  const resolvedImage =
    coalesce(
      normalizeImageEntry(backend.image),
      backend.image_url,
      backend.imageUrl,
      galleryImages[0]
    ) ?? "";

  const resolvedCategoryId =
    coalesce(backend.category_id, backend.categoryId, backend.category?.id) ??
    "";
  const resolvedSubcategoryId = coalesce(
    backend.subcategory_id,
    backend.subcategoryId
  );

  return {
    id: backend.id,
    name: backend.name,
    description: backend.description ?? "",
    price,
    category: resolvedCategoryId,
    subcategory: resolvedSubcategoryId ?? undefined,
    image: resolvedImage,
    image_url:
      coalesce(
        backend.image_url,
        backend.imageUrl,
        normalizeImageEntry(backend.image)
      ) ?? undefined,
    gallery: galleryImages,
    ingredients: normalizeIngredients(backend.ingredients),
    allergens: backend.allergens ?? [],
    isVegetarian: backend.is_vegetarian ?? backend.isVegetarian,
    isSpicy: backend.is_spicy ?? backend.isSpicy,
    isGlutenFree: backend.is_gluten_free ?? backend.isGlutenFree,
    isChefSpecial: backend.is_chef_special ?? backend.isChefSpecial,
    isRecommended: backend.is_recommended ?? backend.isRecommended,
  };
};

export const fetchCategories = async () => {
  return apiFetch<Category[]>("/api/categories");
};

export const createCategory = (formData: FormData) =>
  apiFetch<any>("/api/categories", { method: "POST", body: formData });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, FormData>({
    mutationFn: createCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};

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
  return apiFetch<BackendProduct[]>(path).then((products) =>
    products.map(normalizeProduct)
  );
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
  apiFetch<BackendProduct>(`/api/products/${productId}`).then(normalizeProduct);

export const useProduct = (productId: string | undefined) =>
  useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId!),
    enabled: Boolean(productId),
  });

export const createProduct = (formData: FormData) =>
  apiFetch<BackendProduct>("/api/products", {
    method: "POST",
    body: formData,
  }).then(normalizeProduct);

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, FormData>({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

type UpdateProductInput = {
  productId: string;
  formData: FormData;
};

const updateProduct = ({ productId, formData }: UpdateProductInput) =>
  apiFetch<BackendProduct>(`/api/products/${productId}`, {
    method: "PUT",
    body: formData,
  }).then(normalizeProduct);

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, UpdateProductInput>({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};

type UploadProductImageInput = {
  productId: string;
  file: File;
};

const uploadProductImage = ({ productId, file }: UploadProductImageInput) => {
  const formData = new FormData();
  formData.append("image", file);
  return apiFetch<BackendProduct>(`/api/products/${productId}/image`, {
    method: "POST",
    body: formData,
  }).then(normalizeProduct);
};

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, UploadProductImageInput>({
    mutationFn: uploadProductImage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

// Orders
type OrdersQueryParams = {
  status?: string;
  paymentStatus?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

type OrdersResponse = {
  data: any[];
  meta?: { total: number; page: number; limit: number; pages: number };
};

export const fetchOrders = (params?: OrdersQueryParams) => {
  const qs = new URLSearchParams();
  if (params) {
    if (params.status) qs.set("status", params.status);
    if (params.paymentStatus) qs.set("paymentStatus", params.paymentStatus);
    if (params.from) qs.set("from", params.from);
    if (params.to) qs.set("to", params.to);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
  }
  const path = qs.toString() ? `/api/orders?${qs.toString()}` : "/api/orders";
  return apiFetch<OrdersResponse>(path);
};

export const useOrders = (params?: OrdersQueryParams) =>
  useQuery<OrdersResponse, Error>({
    queryKey: ["orders", params ?? {}],
    queryFn: () => fetchOrders(params),
  });

export const fetchOrderByNumber = (number: string) =>
  apiFetch<any>(`/api/orders/${number}`);

export const fetchOrderStatus = (orderId: string) =>
  apiFetch<any>(`/api/orders/${orderId}/status`);

export const updateOrderStatus = (orderId: string, body: any) =>
  apiFetch<any>(`/api/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const cancelOrder = (orderId: string) =>
  apiFetch<any>(`/api/orders/${orderId}/cancel`, { method: "PUT" });

export const fetchOrdersSummary = () => apiFetch<any>("/api/orders/summary");

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: cancelOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation<any, Error, { orderId: string; body: any }>({
    mutationFn: ({ orderId, body }) => updateOrderStatus(orderId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useOrdersSummary = () =>
  useQuery<any, Error>({
    queryKey: ["orders", "summary"],
    queryFn: fetchOrdersSummary,
  });

export const useOrderByNumber = (number?: string) =>
  useQuery<any, Error>({
    queryKey: ["order", number],
    queryFn: () => fetchOrderByNumber(number!),
    enabled: Boolean(number),
  });

export const useOrderStatus = (orderId?: string) =>
  useQuery<any, Error>({
    queryKey: ["order", orderId, "status"],
    queryFn: () => fetchOrderStatus(orderId!),
    enabled: Boolean(orderId),
  });

export type Reservation = {
  id: string;
  reservation_code: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  specialRequests?: string;
  status?: string;
  created_at?: string;
  message?: string;
};

const normalizeReservation = (backend: any): Reservation => {
  return {
    id: backend.id,
    reservation_code: backend.reservation_code,
    fullName: backend.full_name ?? backend.fullName,
    email: backend.email,
    phoneNumber: backend.phone_number ?? backend.phoneNumber,
    reservationDate: backend.reservation_date ?? backend.reservationDate,
    reservationTime: backend.reservation_time ?? backend.reservationTime,
    numberOfGuests: backend.number_of_guests ?? backend.numberOfGuests,
    specialRequests: backend.special_requests ?? backend.specialRequests,
    status: backend.status,
    created_at: backend.created_at,
    message: backend.message,
  };
};

export const fetchReservations = (params?: { email?: string }) => {
  const qs = new URLSearchParams();
  if (params?.email) qs.set("email", params.email);
  const path = qs.toString() ? `/api/reservations?${qs.toString()}` : "/api/reservations";
  return apiFetch<any[]>(path).then((data) => data.map(normalizeReservation));
};

export const updateReservationStatus = (code: string, status: string) =>
  apiFetch<any>(`/api/reservations/${code}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const useUpdateReservationStatus = () => {
  const qc = useQueryClient();
  return useMutation<any, Error, { code: string; status: string }>({
    mutationFn: ({ code, status }) => updateReservationStatus(code, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations"] }),
  });
};

export const fetchReservationByCode = (code: string) =>
  apiFetch<any>(`/api/reservations/${code}`).then(normalizeReservation);

export const useReservations = (email?: string) =>
  useQuery<Reservation[], Error>({
    queryKey: ["reservations", email ?? null],
    queryFn: () => fetchReservations(email ? { email } : undefined),
    enabled: true,
  });

export const useReservationByCode = (code?: string) =>
  useQuery<Reservation, Error>({
    queryKey: ["reservation", code],
    queryFn: () => fetchReservationByCode(code!),
    enabled: Boolean(code),
  });


