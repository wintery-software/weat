"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </SWRConfig>
  );
}
