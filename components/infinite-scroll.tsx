import { LoadingSpinner } from "@/components/loading-spinner";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { type ReactNode } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  className?: string;
  loadingClassName?: string;
}

export const InfiniteScroll = ({
  children,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  loadingComponent,
  endMessage,
  className = "",
  loadingClassName = "flex items-center justify-center py-8",
}: InfiniteScrollProps) => {
  const { loadingRef } = useInfiniteScroll(
    onLoadMore,
    hasNextPage,
    isFetchingNextPage,
  );

  return (
    <div className={className}>
      {children}

      {/* Loading indicator and infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadingRef} className={loadingClassName}>
          {isFetchingNextPage && (loadingComponent || <LoadingSpinner />)}
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && endMessage && (
        <div className={loadingClassName}>{endMessage}</div>
      )}
    </div>
  );
};
