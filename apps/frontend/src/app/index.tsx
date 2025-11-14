import { createFileRoute } from "@tanstack/react-router";
import { MachineTuring } from "@/components/MachineTuring";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <MachineTuring />
    </div>
  );
}
