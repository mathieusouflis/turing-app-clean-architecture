import { useEffect } from "react";
import { MainLayout } from "@/components/layout/Main";
import { createRootRoute, Outlet } from "@tanstack/react-router";

function RootComponent() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
