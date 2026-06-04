import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiProduct } from "@/types/service";

interface ApiResponse<T> { success: boolean; data: T }

interface ProductFilters {
  search?: string;
  category?: string;
  condition?: string;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params: Record<string, string | undefined> = {};
      if (filters.search)    params.search    = filters.search;
      if (filters.category)  params.category  = filters.category;
      if (filters.condition) params.condition = filters.condition;
      const res = await api.get<ApiResponse<ApiProduct[]>>("/products", { params });
      return res.data.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string; description: string; category: string;
      price: number; condition: string;
    }) => {
      const res = await api.post<ApiResponse<ApiProduct>>("/products", payload);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/products/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
