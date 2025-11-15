import { TuringMachinePage } from "@/components/pages/turing-machine";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/turing-machine/$id")({
  component: TuringMachineWrapper,
});

export function TuringMachineWrapper() {
  return <TuringMachinePage path={Route.fullPath} />;
}
