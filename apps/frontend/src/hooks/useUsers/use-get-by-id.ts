import { apiClient } from "@/api/client";
import { TAGS } from "@/api/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useGetById = (id: string) => {
  return useQuery({
    queryKey: TAGS.turingMachine.detail(id),
    queryFn: () => apiClient.TuringMachine.getById(id),
    enabled: !!id,
  });
};
