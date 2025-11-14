import { apiConfig } from "@/config/api.config";

export async function _delete(id: string): Promise<void> {
  const response = await fetch(
    `${apiConfig.baseUrl}${apiConfig.endpoints.turingMachine.byId(id)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete Turing Machine: ${response.statusText}`);
  }
}
