import { apiConfig } from "@/config/api.config";
import { type TuringMachineRecordType } from "@repo/types";

export async function list(): Promise<TuringMachineRecordType[]> {
  console.log("FETCHING LIST");
  const response = await fetch(`${apiConfig.baseUrl}/turing-machines`);

  if (!response.ok) {
    throw new Error(`Failed to get Turing Machines: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
