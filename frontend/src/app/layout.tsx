import React from "react";
import "./globals.css";
import { AppProvider } from "@/store/AppContext";
import { CyberBackground, Scanline } from "@/components/shared/CyberBackground";
import { MainLayout } from "@/components/layout/MainLayout";

export const metadata = {
  title: "Threat2Risk AI | Cybersecurity Investigation & Risk Intelligence",
  description: "Raw Security Evidence -> Attack Story -> Business Risk -> Control Intelligence -> Action",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: "#05070b", color: "#e2e8f0" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-ink-950 text-slate-100 min-h-screen antialiased selection:bg-cyber-cyan/30 selection:text-white" style={{ backgroundColor: "#05070b", color: "#e2e8f0" }}>
        <AppProvider>
          <CyberBackground variant="grid" />
          <Scanline />
          <MainLayout>
            {children}
          </MainLayout>
        </AppProvider>
      </body>
    </html>
  );
}
