import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome Home!</h1>
      <p className="text-lg text-gray-600">
        This is your home page using TanStack Router with the app folder as routes.
      </p>
    </div>
  );
}
