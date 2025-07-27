"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { RefreshCw } from "lucide-react";
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
    <div className="flex min-h-full flex-col items-center justify-center gap-4 py-8 text-center">
      <div
        className="size-24 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/error-two-dogs.png")' }}
        role="img"
        aria-label="Error"
      />
      <div className="space-y-1">
        <p className="text-lg font-semibold">出错了</p>
        <p className="text-muted-foreground max-w-xs text-sm break-words">
          {errorMessage}
        </p>
      </div>
      <Button onClick={handleRetry} className="group w-36 cursor-pointer">
        <RefreshCw className="size-4 transition-transform duration-300 group-hover:rotate-180" />
        重试
      </Button>
      <Button
        variant={"link"}
        size={"sm"}
        className="text-muted-foreground text-xs"
        asChild
      >
        <Link href="/help" target="_blank">
          查看帮助
        </Link>
      </Button>
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
