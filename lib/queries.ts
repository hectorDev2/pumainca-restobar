"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, Product, SubCategory } from "@/types";
import type { OrderStatus, PaymentStatus } from "@/types/domain";
import type { SiteSettings } from "@/types/common";
import { apiFetch } from "@/lib/api";

export type ProductFilters = {
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
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
  preparation_time_minutes?: number | string | null;
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
  prices?: BackendProductPrice[],
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
    entry?: string | BackendImageEntry | null,
  ): string | undefined => {
    if (!entry) return undefined;
    return typeof entry === "string" ? entry : entry.imageUrl;
  };

  const normalizeGallery = (
    gallery?: (string | BackendImageEntry)[],
  ): string[] => {
    if (!gallery) return [];
    return gallery
      .map((item) => normalizeImageEntry(item))
      .filter((src): src is string => Boolean(src));
  };

  const normalizeIngredients = (
    ingredients?: (string | BackendIngredientEntry)[],
  ): string[] => {
    if (!ingredients) return [];
    return ingredients
      .map((item) =>
        typeof item === "string" ? item : (item.ingredient ?? undefined),
      )
      .filter((ing): ing is string => Boolean(ing));
  };

  const galleryImages = normalizeGallery(backend.gallery);
  const resolvedImage =
    coalesce(
      normalizeImageEntry(backend.image),
      backend.image_url,
      backend.imageUrl,
      galleryImages[0],
    ) ?? "";

  const resolvedCategoryId =
    coalesce(backend.category_id, backend.categoryId, backend.category?.id) ??
    "";
  const resolvedSubcategoryId = coalesce(
    backend.subcategory_id,
    backend.subcategoryId,
  );

  return {
    id: backend.id,
    name: backend.name,
    description: backend.description ?? "",
    price,
    category: resolvedCategoryId,
    subcategory: resolvedSubcategoryId ?? undefined,
    image_url:
      coalesce(
        backend.image_url,
        backend.imageUrl,
        normalizeImageEntry(backend.image),
      ) ?? "",
    gallery: galleryImages,
    ingredients: normalizeIngredients(backend.ingredients),
    allergens: backend.allergens ?? [],
    isVegetarian: backend.is_vegetarian ?? backend.isVegetarian,
    isSpicy: backend.is_spicy ?? backend.isSpicy,
    isGlutenFree: backend.is_gluten_free ?? backend.isGlutenFree,
    isChefSpecial: backend.is_chef_special ?? backend.isChefSpecial,
    isRecommended: backend.is_recommended ?? backend.isRecommended,
    isVariablePrice: backend.is_variable_price ?? backend.isVariablePrice,
    preparationTimeMinutes: parseNumberValue(
      backend.preparation_time_minutes as number | string | null | undefined,
    ),
  };
};

export const fetchCategories = async () => {
  return apiFetch<Category[]>("/api/categories");
};

export const createCategory = (formData: FormData) =>
  apiFetch<Category>("/api/categories", { method: "POST", body: formData });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, FormData>({
    mutationFn: createCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};

type UpdateCategoryInput = {
  categoryId: string;
  formData: FormData;
};

const updateCategory = ({ categoryId, formData }: UpdateCategoryInput) =>
  apiFetch<Category>(`/api/categories/${categoryId}`, {
    method: "PUT",
    body: formData,
  });

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, UpdateCategoryInput>({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

const deleteCategory = (categoryId: string) =>
  apiFetch<{ message: string; id: string }>(`/api/categories/${categoryId}`, {
    method: "DELETE",
  });

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; id: string }, Error, string, { previous: Category[] | undefined }>({
    mutationFn: deleteCategory,
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previous = queryClient.getQueryData<Category[]>(["categories"]);
      queryClient.setQueryData<Category[]>(["categories"], (old) =>
        old?.filter((c) => c.id !== categoryId) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["categories"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
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

  if (filters.limit) {
    params.set("limit", filters.limit.toString());
  }

  const query = params.toString();
  const path = query ? `/api/products?${query}` : "/api/products";
  return apiFetch<BackendProduct[]>(path).then((products) =>
    products.map(normalizeProduct),
  );
};

export const useProducts = (filters: ProductFilters) =>
  useQuery<Product[], Error>({
    queryKey: [
      "products",
      filters.category ?? null,
      filters.search ?? "",
      filters.sort ?? "",
      filters.limit ?? null,
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

const deleteProduct = (productId: string) =>
  apiFetch<{ message: string; id: string; deletedImages: number }>(
    `/api/products/${productId}`,
    { method: "DELETE" },
  );

type DeleteProductContext = {
  queries: [unknown, Product[] | undefined][];
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string; id: string; deletedImages: number },
    Error,
    string,
    DeleteProductContext
  >({
    mutationFn: deleteProduct,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const queries = queryClient.getQueriesData<Product[]>({
        queryKey: ["products"],
      });
      queryClient.setQueriesData<Product[]>({ queryKey: ["products"] }, (old) =>
        old?.filter((p) => p.id !== productId),
      );
      return { queries };
    },
    onError: (_, __, context) => {
      context?.queries.forEach(([key, data]) => {
        queryClient.setQueryData(key as Parameters<typeof queryClient.setQueryData>[0], data);
      });
    },
    onSettled: () => {
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
export type BackendOrderItem = {
  id?: string;
  order_id?: string;
  product_id?: string;
  product_name?: string;
  quantity?: number;
  unit_price?: number;
  subtotal?: number;
  selected_size?: string;
  cooking_point?: string;
  special_instructions?: string;
};

export type BackendOrder = {
  id: string;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  payment_method?: string;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  subtotal?: number;
  tax_amount?: number;
  service_fee?: number;
  total_amount?: number;
  pickup_time_estimate?: string;
  special_instructions?: string;
  created_at?: string;
  updated_at?: string;
  items?: BackendOrderItem[];
};

type OrderStatusResponse = {
  status: OrderStatus;
  payment_status: PaymentStatus;
};

export type UpdateOrderStatusBody = {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
};

type OrdersSummary = {
  totalOrders: number | null;
  revenue: number;
  statusBreakdown: {
    pending: number;
    preparing: number;
    ready: number;
    completed: number;
    cancelled: number;
  };
};

type OrdersQueryParams = {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

type OrdersResponse = {
  data: BackendOrder[];
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
  apiFetch<BackendOrder>(`/api/orders/${number}`);

export const fetchOrderStatus = (orderId: string) =>
  apiFetch<OrderStatusResponse>(`/api/orders/${orderId}/status`);

export const updateOrderStatus = (orderId: string, body: UpdateOrderStatusBody) =>
  apiFetch<BackendOrder>(`/api/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const cancelOrder = (orderId: string) =>
  apiFetch<BackendOrder>(`/api/orders/${orderId}/cancel`, { method: "PUT" });

export const fetchOrdersSummary = () =>
  apiFetch<OrdersSummary>("/api/orders/summary");

// Filtra solo queries de lista de órdenes, excluyendo el summary
const ordersListFilter = {
  predicate: (query: { queryKey: unknown }) => {
    const key = query.queryKey as unknown[];
    return key[0] === "orders" && key[1] !== "summary";
  },
};

type OrdersContext = { queries: [unknown, OrdersResponse | undefined][] };

const matchesOrderId = (order: BackendOrder, id: string): boolean =>
  order.id === id || order.order_number === id;

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation<BackendOrder, Error, string, OrdersContext>({
    mutationFn: cancelOrder,
    onMutate: async (orderId) => {
      await qc.cancelQueries(ordersListFilter);
      const queries = qc.getQueriesData<OrdersResponse>(ordersListFilter);
      qc.setQueriesData<OrdersResponse>(ordersListFilter, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((order) =>
            matchesOrderId(order, orderId)
              ? { ...order, status: "cancelled" as const }
              : order,
          ),
        };
      });
      return { queries };
    },
    onError: (_, __, context) => {
      context?.queries.forEach(([key, data]) => {
        qc.setQueryData(key as Parameters<typeof qc.setQueryData>[0], data);
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation<
    BackendOrder,
    Error,
    { orderId: string; body: UpdateOrderStatusBody },
    OrdersContext
  >({
    mutationFn: ({ orderId, body }) => updateOrderStatus(orderId, body),
    onMutate: async ({ orderId, body }) => {
      await qc.cancelQueries(ordersListFilter);
      const queries = qc.getQueriesData<OrdersResponse>(ordersListFilter);
      qc.setQueriesData<OrdersResponse>(ordersListFilter, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((order) =>
            matchesOrderId(order, orderId) ? { ...order, ...body } : order,
          ),
        };
      });
      return { queries };
    },
    onError: (_, __, context) => {
      context?.queries.forEach(([key, data]) => {
        qc.setQueryData(key as Parameters<typeof qc.setQueryData>[0], data);
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useOrdersSummary = () =>
  useQuery<OrdersSummary, Error>({
    queryKey: ["orders", "summary"],
    queryFn: fetchOrdersSummary,
  });

export const useOrderByNumber = (number?: string) =>
  useQuery<BackendOrder, Error>({
    queryKey: ["order", number],
    queryFn: () => fetchOrderByNumber(number!),
    enabled: Boolean(number),
  });

export const useOrderStatus = (orderId?: string) =>
  useQuery<OrderStatusResponse, Error>({
    queryKey: ["order", orderId, "status"],
    queryFn: () => fetchOrderStatus(orderId!),
    enabled: Boolean(orderId),
  });

// Reservations
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

export const fetchReservations = (params?: { email?: string }) => {
  const qs = new URLSearchParams();
  if (params?.email) qs.set("email", params.email);
  const path = qs.toString()
    ? `/api/reservations?${qs.toString()}`
    : "/api/reservations";
  return apiFetch<Reservation[]>(path);
};

export const fetchReservationByCode = (code: string) =>
  apiFetch<Reservation>(`/api/reservations/${code}`);

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

// Settings
export const fetchSettings = () => apiFetch<SiteSettings>("/api/settings");

export const useSettings = () =>
  useQuery<SiteSettings, Error>({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

export const updateSettings = (body: SiteSettings) =>
  apiFetch<SiteSettings>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation<SiteSettings, Error, SiteSettings>({
    mutationFn: updateSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
};
