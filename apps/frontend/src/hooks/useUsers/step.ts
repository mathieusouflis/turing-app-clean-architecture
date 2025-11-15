import { apiClient } from "@/api/client";
import { TAGS } from "@/api/queryKeys";
import type { TuringMachineRecordType } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.TuringMachine.step(id),
    onSuccess: (data: TuringMachineRecordType, id: string) => {
      queryClient.setQueryData(TAGS.turingMachine.detail(id), data);

      queryClient.invalidateQueries({
        queryKey: TAGS.turingMachine.lists(),
      });
    },
  });
};
