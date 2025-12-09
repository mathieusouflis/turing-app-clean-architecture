import { Button } from "@/components/ui/button";
import { useTuringMachines } from "@/hooks/use-turing-machines";
import { useParams } from "@tanstack/react-router";

export function TuringMachinePage(props: { path: string }) {
  const { id } = useParams({
    from: props.path,
  });

  const userApi = useTuringMachines();
  const { data: machine, error, isLoading, isError } = userApi.useGetById(id);
  const stepMutation = userApi.useStep();
  const runMutation = userApi.useRun();

  const handleStep = () => {
    if (!machine) return;

    stepMutation.mutate(id, {
      onSuccess: (data) => {
        console.log("Step executed successfully:", data);
      },
      onError: (error) => {
        console.error("Step failed:", error);
      },
    });
  };

  const handleRun = () => {
    if (!machine) return;

    runMutation.mutate(id, {
      onSuccess: (data) => {
        console.log("Run completed successfully:", data);
      },
      onError: (error) => {
        console.error("Run failed:", error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error: {error?.message || "An error occurred"}
        </div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Machine not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Turing Machine</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Tape</h2>
        <p className="font-mono bg-gray-100 p-4 rounded">{machine.tape}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">State</h2>
        <p className="font-mono">{machine.currentState}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Head Position</h2>
        <p className="font-mono">{machine.headPosition}</p>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleStep} disabled={stepMutation.isPending}>
          {stepMutation.isPending ? "Stepping..." : "Step"}
        </Button>

        <Button onClick={handleRun} disabled={runMutation.isPending}>
          {runMutation.isPending ? "Running..." : "Run"}
        </Button>
      </div>

      {stepMutation.isError && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Step error: {stepMutation.error.message}
        </div>
      )}

      {runMutation.isError && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Run error: {runMutation.error.message}
        </div>
      )}
    </div>
  );
}
