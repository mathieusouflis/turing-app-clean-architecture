import { TuringMachineCard } from "./turing-machine-card";
import { useUsers } from "@/hooks/useUsers";

export function Homepage() {
  const userApi = useUsers();
  const { data, isLoading, isError, error } = userApi.useList();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading machines...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error: {error?.message || "Failed to load machines"}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">
          No machines found. Create your first Turing machine!
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Your Machines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((machine) => (
          <TuringMachineCard
            key={machine.id}
            tape={machine.tape}
            id={machine.id}
          />
        ))}
      </div>
    </div>
  );
}
