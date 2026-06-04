import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiService } from "@/types/service";

interface ApiResponse<T> { success: boolean; data: T }

interface ServiceFilters {
  search?: string;
  category?: string;
  mine?: boolean;
}

export function useServices(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: ["services", filters],
    queryFn: async () => {
      const params: Record<string, string | boolean | undefined> = {};
      if (filters.search)   params.search   = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.mine)     params.mine     = true;
      const res = await api.get<ApiResponse<ApiService[]>>("/services", { params });
      return res.data.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string; description: string; category: string;
      price: number; priceType: string;
    }) => {
      const res = await api.post<ApiResponse<ApiService>>("/services", payload);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useRequestService(serviceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const res = await api.post(`/services/${serviceId}/requests`, { message });
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/services/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}
