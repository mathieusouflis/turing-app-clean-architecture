import { apiConfig } from "@/config/api.config";
import { type TuringMachineRecordType } from "@repo/types";

export async function step(id: string): Promise<TuringMachineRecordType> {
  const response = await fetch(
    `${apiConfig.baseUrl}${apiConfig.endpoints.turingMachine.step(id)}`,
    {
      method: "PUT",
    },
  );

  if (!response.ok) {
    const errorMessage = `Failed to step turing machine: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return await response.json();
}
