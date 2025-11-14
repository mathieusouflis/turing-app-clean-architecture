import { apiConfig } from "@/config/api.config";
import type { TuringMachineRecordType } from "@repo/types";

export async function getById(id: string): Promise<TuringMachineRecordType> {
  const response = await fetch(
    `${apiConfig.baseUrl}${apiConfig.endpoints.turingMachine.byId(id)}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to get Turing Machine: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
