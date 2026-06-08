import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiEvent } from "@/types/event";

interface EventFilters {
  search?: string;
  category?: string;
  sortBy?: "date" | "title" | "capacity";
  cursor?: string;
  limit?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const params: Record<string, string | number | undefined> = {};
      if (filters.search)   params.search   = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.sortBy)   params.sortBy   = filters.sortBy;
      if (filters.cursor)   params.cursor   = filters.cursor;
      if (filters.limit)    params.limit    = filters.limit;

      const res = await api.get<ApiResponse<ApiEvent[]>>("/events", { params });
      return res.data.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiEvent>>(`/events/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

interface CreateEventPayload {
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  capacity: number;
  imageUrl?: string;
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateEventPayload) => {
      const res = await api.post<ApiResponse<ApiEvent>>("/events", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useRegisterEvent(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<ApiResponse<{ qrToken: string }>>(`/events/${eventId}/register`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUnregisterEvent(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/events/${eventId}/register`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
