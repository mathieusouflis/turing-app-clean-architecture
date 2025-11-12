import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-600 mb-4">
        This is the about page of your application.
      </p>
      <p className="text-gray-600">
        Built with TanStack Router and configured to use the app folder as the routes directory.
      </p>
    </div>
  );
}
