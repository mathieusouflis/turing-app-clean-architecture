import { apiClient } from "@/api/client";
import { TAGS } from "@/api/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.TuringMachine.delete(id),
    onSuccess: (_data, id: string) => {
      queryClient.removeQueries({
        queryKey: TAGS.turingMachine.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: TAGS.turingMachine.lists(),
      });
    },
  });
};
