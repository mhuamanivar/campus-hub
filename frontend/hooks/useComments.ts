import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ApiComment {
  id: string;
  body: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  parentId: string | null;
  createdAt: string;
  replies: ApiComment[];
}

interface ApiResponse<T> { success: boolean; data: T }

export function useComments(eventId: string) {
  return useQuery({
    queryKey: ["comments", eventId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiComment[]>>(`/events/${eventId}/comments`);
      return res.data.data;
    },
    enabled: !!eventId,
  });
}

export function useAddComment(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { body: string; parentId?: string }) => {
      const res = await api.post<ApiResponse<ApiComment>>(`/events/${eventId}/comments`, payload);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", eventId] }),
  });
}

export function useDeleteComment(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      await api.delete(`/comments/${commentId}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", eventId] }),
  });
}
