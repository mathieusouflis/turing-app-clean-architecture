import { apiClient } from "@/api/client";
import { TAGS } from "@/api/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useList = () => {
  return useQuery({
    queryKey: TAGS.turingMachine.lists(),
    queryFn: () => apiClient.TuringMachine.list(),
  });
};
