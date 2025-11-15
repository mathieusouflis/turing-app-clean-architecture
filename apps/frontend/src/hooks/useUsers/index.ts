import { useCreate } from "./create";
import { useDelete } from "./delete";
import { useRun } from "./run";
import { useStep } from "./step";
import { useGetById } from "./use-get-by-id";
import { useList } from "./use-list";

export const useUsers = () => {
  return {
    useList,
    useGetById,
    useStep,
    useRun,
    useDelete,
    useCreate,
  };
};
