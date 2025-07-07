import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";
import { RestaurantContent } from "./restaurant-content";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="加载中" />}>
        <RestaurantContent id={id} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Page;
