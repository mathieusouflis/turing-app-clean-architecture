import { apiConfig } from "@/config/api.config";
import {
  type TuringMachineRecordType,
  type UpdateTuringMachineRecordType,
} from "@repo/types";

export async function update(
  id: string,
  data: UpdateTuringMachineRecordType,
): Promise<TuringMachineRecordType> {
  const response = await fetch(
    `${apiConfig.baseUrl}${apiConfig.endpoints.turingMachine.byId(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorMessage = `Failed to update Turing machine: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return await response.json();
}
