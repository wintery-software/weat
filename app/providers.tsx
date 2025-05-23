"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APIProvider } from "@vis.gl/react-google-maps";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
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
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["core", "marker", "places"]}>
              {children}
            </APIProvider>
          </QueryClientProvider>
        </SessionProvider>
      </TooltipProvider>
    </NextThemesProvider>
  );
}
