import { useEffect, useRef } from "react";

export const useInfiniteScroll = (
  callback: () => void,
  hasNextPage: boolean,
  isFetching: boolean,
  threshold = 300,
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetching) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      {
        rootMargin: `${threshold}px`,
      },
    );

    // Observe the loading element
    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, hasNextPage, isFetching, threshold]);

  return { loadingRef };
};
