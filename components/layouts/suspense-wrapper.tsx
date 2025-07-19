import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { type PropsWithChildren, type ReactNode, Suspense } from "react";

export interface SuspenseWrapperProps extends PropsWithChildren {
  fallback?: ReactNode;
}

export const SuspenseWrapper = ({
  children,
  fallback = <LoadingSpinner />,
}: SuspenseWrapperProps) => (
  <ErrorBoundary>
    <Suspense fallback={fallback}>{children}</Suspense>
  </ErrorBoundary>
);
