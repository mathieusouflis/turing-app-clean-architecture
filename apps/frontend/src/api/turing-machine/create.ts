import { apiConfig } from "@/config/api.config";
import {
  type NewTuringMachineRecordType,
  type TuringMachineRecordType,
} from "@repo/types";

export async function create(
  data: NewTuringMachineRecordType,
): Promise<TuringMachineRecordType> {
  const response = await fetch(
    `${apiConfig.baseUrl}${apiConfig.endpoints.turingMachine.base}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create: ${response.statusText}`,
    );
  }

  return response.json();
}
