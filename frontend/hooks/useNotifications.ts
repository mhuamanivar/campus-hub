import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiNotification } from "@/types/service";
import { useAuth } from "@/components/auth/AuthContext";

interface ApiResponse<T> { success: boolean; data: T }

export function useNotifications(limit = 20) {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiNotification[]>>("/notifications", {
        params: { limit },
      });
      return res.data.data;
    },
    enabled: isLoggedIn,
    refetchInterval: 30000, // poll every 30s
  });
}

export function useUnreadCount() {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
      return res.data.data.count;
    },
    enabled: isLoggedIn,
    refetchInterval: 30000,
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => { await api.patch("/notifications/read-all"); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
