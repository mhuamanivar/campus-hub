import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiEvent } from "@/types/event";
import type { ApiService, ApiProduct, ApiLoan } from "@/types/service";
import { useAuth } from "@/components/auth/AuthContext";

interface ApiResponse<T> { success: boolean; data: T }

export function useMyEvents() {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ["events", { mine: true }],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiEvent[]>>("/events", { params: { mine: true } });
      return res.data.data;
    },
    enabled: isLoggedIn,
  });
}

export function useMyRegisteredEvents() {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ["events", "registered"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiEvent[]>>("/events");
      return res.data.data.filter((e) => e.isRegistered);
    },
    enabled: isLoggedIn,
  });
}

export function useMyServices() {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ["services", { mine: true }],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiService[]>>("/services", { params: { mine: true } });
      return res.data.data;
    },
    enabled: isLoggedIn,
  });
}

export function useMyProducts() {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ["products", "my"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiProduct[]>>("/products/my");
      return res.data.data;
    },
    enabled: isLoggedIn,
  });
}

export function useMyLoanCount() {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ["loans", "my"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiLoan[]>>("/loans/my");
      return res.data.data;
    },
    enabled: isLoggedIn,
  });
}
