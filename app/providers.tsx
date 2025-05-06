"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: (error, query) => {
        toast.error("Failed to fetch data", {
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
    <TooltipProvider>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SessionProvider>
    </TooltipProvider>
  );
}
