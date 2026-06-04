import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ReactionData {
  counts: Record<string, number>;
  userReaction: string | null;
}

interface ApiResponse<T> { success: boolean; data: T }

export function useReactions(eventId: string) {
  return useQuery({
    queryKey: ["reactions", eventId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ReactionData>>(`/events/${eventId}/reactions`);
      return res.data.data;
    },
    enabled: !!eventId,
  });
}

export function useToggleReaction(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (type: string) => {
      const res = await api.post<ApiResponse<{ toggled: string; type: string }>>(
        `/events/${eventId}/reactions`,
        { type },
      );
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reactions", eventId] }),
  });
}
