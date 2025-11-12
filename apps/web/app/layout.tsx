import type { Metadata } from "next";
import "./globals.css";

import { Main } from "@/components/layout/Main";

export const metadata: Metadata = {
  title: "My website made with Turborepo",
  description: "Made with ❤️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Main>{children}</Main>
      </body>
    </html>
  );
}
