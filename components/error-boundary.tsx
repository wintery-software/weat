"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { ReactNode } from "react";
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

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertTriangle className="text-destructive h-12 w-12" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">出错了</h3>
          <p className="text-muted-foreground text-sm">
            请稍后再试，如果问题持续出现，请联系我们。
          </p>
          {error.message && (
            <p className="text-muted-foreground font-mono text-xs">
              {error.message}
            </p>
          )}
        </div>
        <Button
          onClick={handleRetry}
          variant="outline"
          className="group cursor-pointer gap-2"
        >
          <RefreshCw className="size-4 transition-transform duration-300 group-hover:rotate-180" />
          重试
        </Button>
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
