import { apiConfig } from "@/config/api.config";
import { type TuringMachineRecordType } from "@repo/types";

export async function run(id: string): Promise<TuringMachineRecordType> {
  const response = await fetch(
    `${apiConfig.baseUrl}${apiConfig.endpoints.turingMachine.run(id)}`,
    {
      method: "PUT",
    },
  );

  if (!response.ok) {
    const errorMessage = `Failed to run turing machine: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response.json();
}
