import { useState } from "react";
import { useDebounce } from "./useDebounce";
import { useProducts } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/types";

/**
 * Hook especializado para búsqueda en la navbar
 * Maneja: debounce, caché local, búsqueda en servidor
 */
export function useNavbarSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebounce(searchTerm, 300);

  const queryClient = useQueryClient();
  const fullMenuKey = ["products", null, "", "recommended", null];
  const cachedMenuData = queryClient.getQueryData<Product[]>(fullMenuKey);

  const shouldFetchFromServer = debouncedTerm.length >= 2 && !cachedMenuData;

  const { data: serverSearchResults, isFetching } = useProducts({
    search: debouncedTerm.length >= 2 ? debouncedTerm : "___NO_SEARCH___",
    limit: 6,
  });

  const searchResults = (() => {
    if (debouncedTerm.length < 2) return [];

    if (cachedMenuData) {
      const lowerTerm = debouncedTerm.toLowerCase();
      return cachedMenuData
        .filter(
          (p) =>
            p.name.toLowerCase().includes(lowerTerm) ||
            (p.category && p.category.toLowerCase().includes(lowerTerm)),
        )
        .slice(0, 6);
    }

    return serverSearchResults || [];
  })();

  const isLoading = !cachedMenuData && isFetching;

  return {
    searchTerm,
    setSearchTerm,
    debouncedTerm,
    searchResults,
    isLoading,
  };
}
