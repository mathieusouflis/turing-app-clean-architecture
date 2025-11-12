import GridPreview from "@/components/base/grid-preview";
import { Footer } from "./footer";
import { Nav } from "./nav-bar";

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <GridPreview />
      <Nav />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
