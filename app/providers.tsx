"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: (error, query) => {
        toast.error("Failed to fetch", {
          id: query.queryKey.toString(), // Make sure no duplicate toasts are shown
          description: error.message,
        });

        // Return false to prevent the default error handling
        return false;
      },
    },
    mutations: {
      throwOnError: true,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/*<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>*/}
      {children}
      {/*</ThemeProvider>*/}
    </QueryClientProvider>
  );
}
