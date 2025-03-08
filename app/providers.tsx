"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { APIProvider } from "@vis.gl/react-google-maps";
import { type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["core", "marker"]}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </APIProvider>
  );
}
