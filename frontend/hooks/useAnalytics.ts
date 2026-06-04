import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface ApiResponse<T> { success: boolean; data: T }

export interface AnalyticsOverview {
  totalEvents: number;
  totalRegistrations: number;
  totalUsers: number;
  totalServices: number;
  totalProducts: number;
  totalAttendances: number;
  attendanceRate: number;
}

export interface PopularEvent {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  date: string;
  registrationCount: number;
}

export interface CategoryCount {
  name: string;
  value: number;
}

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<AnalyticsOverview>>("/analytics/overview");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePopularEvents(limit = 5) {
  return useQuery({
    queryKey: ["analytics", "popular", limit],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PopularEvent[]>>("/analytics/events/popular", {
        params: { limit },
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useEventsByCategory() {
  return useQuery({
    queryKey: ["analytics", "by-category"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<CategoryCount[]>>("/analytics/events/by-category");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useEventDistribution() {
  return useQuery({
    queryKey: ["analytics", "distribution"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<CategoryCount[]>>("/analytics/events/distribution");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
