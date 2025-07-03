import { ErrorBoundary } from "@/components/error-boundary";
import { NavbarLayout } from "@/components/layouts/navbar-layout";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";
import { RestaurantFilters } from "./restaurant-filters";
import { RestaurantResults } from "./restaurant-results";

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <NavbarLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">发现餐厅</h1>
          <p className="text-muted-foreground mt-2">
            发现你附近的餐厅，并查看它们的评价和评分。
          </p>
        </div>
        <RestaurantFilters />
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner message="加载中" />}>
            <RestaurantResults />
          </Suspense>
        </ErrorBoundary>
      </div>
    </NavbarLayout>
  );
};

export default Page;
