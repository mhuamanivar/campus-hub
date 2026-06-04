import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiResource, ApiLoan } from "@/types/service";

interface ApiResponse<T> { success: boolean; data: T }

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiResource[]>>("/resources");
      return res.data.data;
    },
  });
}

export function useMyLoans() {
  return useQuery({
    queryKey: ["loans", "my"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ApiLoan[]>>("/loans/my");
      return res.data.data;
    },
  });
}

export function useRequestLoan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { resourceId: string; dueDate: string; notes?: string }) => {
      const res = await api.post<ApiResponse<ApiLoan>>("/loans", payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loans"] });
      qc.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useReturnLoan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (loanId: string) => {
      const res = await api.patch(`/loans/${loanId}`, { status: "RETURNED" });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loans"] });
      qc.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}
