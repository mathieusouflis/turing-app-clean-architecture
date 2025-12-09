import { apiClient } from "@/api/client";
import { TAGS } from "@/api/queryKeys";
import type {
  NewTuringMachineRecordType,
  TuringMachineRecordType,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewTuringMachineRecordType) =>
      apiClient.TuringMachine.create(data),
    onSuccess: (data: TuringMachineRecordType) => {
      queryClient.setQueryData(TAGS.turingMachine.detail(data.id), data);

      queryClient.invalidateQueries({
        queryKey: TAGS.turingMachine.lists(),
      });
    },
  });
};
