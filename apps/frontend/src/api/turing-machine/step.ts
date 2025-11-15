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
    throw new Error(
      `Failed to step turing machine: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
