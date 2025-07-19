"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertTriangle, HelpCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    // Clear all query cache to ensure fresh data
    queryClient.clear();
    // Reset the error boundary
    resetErrorBoundary();
  };

  // Get the error message from axios response or fallback to error.message
  const errorMessage = axios.isAxiosError(error)
    ? error.response?.data?.error || error.message
    : error.message;

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertTriangle className="text-destructive h-12 w-12" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">出错了</h3>
          <p className="text-muted-foreground text-sm">{errorMessage}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRetry} className="group cursor-pointer gap-2">
            <RefreshCw className="size-4 transition-transform duration-300 group-hover:rotate-180" />
            重试
          </Button>
          <Button
            variant="outline"
            className="group cursor-pointer gap-2"
            asChild
          >
            <Link href="/help" target="_blank">
              <HelpCircle className="size-4 transition-transform duration-300 group-hover:rotate-360" />
              帮助
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundary = ({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => (
  <ReactErrorBoundary
    FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
  >
    {children}
  </ReactErrorBoundary>
);
