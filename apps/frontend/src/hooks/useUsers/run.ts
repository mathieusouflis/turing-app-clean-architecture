import { apiClient } from "@/api/client";
import { TAGS } from "@/api/queryKeys";
import type { TuringMachineRecordType } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.TuringMachine.run(id),
    onSuccess: (data: TuringMachineRecordType, id: string) => {
      queryClient.setQueryData(TAGS.turingMachine.detail(id), data);

      queryClient.invalidateQueries({
        queryKey: TAGS.turingMachine.lists(),
      });
    },
  });
};
