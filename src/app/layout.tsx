import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Chapeleta (Minimal Cartola)",
  description: "Acompanhe seu time do Cartola em tempo real, sem distrações.",
  applicationName: "Chapeleta (Minimal Cartola)",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
