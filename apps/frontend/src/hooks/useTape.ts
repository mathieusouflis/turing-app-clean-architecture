import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tapeApi from '@/api/endpoints/tapes';
import { useMachineStore } from '@/stores/useMachineStore';
import type { Tape } from '@/api/endpoints/tapes';

export function useTape() {
  const { tapeId } = useMachineStore();
  
  return useQuery<Tape>({
    queryKey: ['tape', tapeId],
    queryFn: () => tapeApi.getTape(tapeId!),
    enabled: !!tapeId,
  });
}

export function useCreateTape() {
  const queryClient = useQueryClient();
  const { setTapeId } = useMachineStore();
  
  return useMutation<Tape, Error, void>({
    mutationFn: () => tapeApi.createTape(),
    onSuccess: (data) => {
      setTapeId(data.id);
      queryClient.setQueryData<Tape>(['tape', data.id], data);
    },
  });
}

export function useExecuteStep() {
  const queryClient = useQueryClient();
  const { tapeId } = useMachineStore();
  
  return useMutation<Tape, Error, void>({
    mutationFn: () => {
      if (!tapeId) throw new Error('No tape ID');
      return tapeApi.executeStep(tapeId) as Promise<Tape>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Tape>(['tape', tapeId], data);
    },
  });
}

export function useResetTape() {
  const queryClient = useQueryClient();
  const { tapeId } = useMachineStore();
  
  return useMutation<Tape, Error, void>({
    mutationFn: () => {
      if (!tapeId) throw new Error('No tape ID');
      return tapeApi.resetTape(tapeId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Tape>(['tape', tapeId], data);
    },
  });
}
