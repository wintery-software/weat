"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { APIProvider } from "@vis.gl/react-google-maps";
import { type ReactNode } from "react";
import { toast } from "sonner";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        onError: (err: Error, key) => {
          console.error(`${key}:`, err);
          toast.error("Failed to fetch data", {
            description: err.message,
          });
        },
      }}
    >
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["core", "marker"]}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </APIProvider>
    </SWRConfig>
  );
}
