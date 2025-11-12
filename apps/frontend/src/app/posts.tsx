import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/posts")({
  component: Posts,
});
function Posts() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Posts</h1>
      <div className="space-y-4"></div>
    </div>
  );
}
