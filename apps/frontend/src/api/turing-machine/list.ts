import { apiConfig } from "@/config/api.config";
import { type TuringMachineRecordType } from "@repo/types";

export async function list(): Promise<TuringMachineRecordType[]> {
  return await fetch(`${apiConfig.baseUrl}/turing-machines`).then((response) =>
    response.json(),
  );
}
