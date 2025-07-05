import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";
import { RestaurantDetail } from "./restaurant-detail";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="加载中" />}>
        <RestaurantDetail params={params} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Page;
