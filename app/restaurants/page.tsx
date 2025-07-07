import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ResultViewMode, SearchParams } from "@/types/types";
import { Metadata } from "next";
import { Suspense } from "react";
import { RestaurantFilters } from "./restaurant-filters";
import { RestaurantResults } from "./restaurant-results";

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "发现餐厅 - Weat",
  description: "发现你附近的餐厅，并查看它们的评价和评分。",
  openGraph: {
    title: "发现餐厅 - Weat",
    description: "发现你附近的餐厅，并查看它们的评价和评分。",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "发现餐厅 - Weat",
    description: "发现你附近的餐厅，并查看它们的评价和评分。",
  },
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 30;
const DEFAULT_VIEW = "grid" as ResultViewMode;

interface PageProps {
  searchParams: SearchParams;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  // Extract parameters from URL
  const page =
    typeof params.page === "string" ? parseInt(params.page) : DEFAULT_PAGE;

  const pageSize =
    typeof params.page_size === "string"
      ? parseInt(params.page_size)
      : DEFAULT_PAGE_SIZE;

  const view =
    typeof params.view === "string"
      ? params.view === "grid" || params.view === "list"
        ? params.view
        : DEFAULT_VIEW
      : DEFAULT_VIEW;

  return (
    <>
      <div className="container flex flex-col gap-4 py-4 md:gap-6 md:py-8">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">发现餐厅</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            发现你附近的餐厅，并查看它们的评价和评分。
          </p>
        </div>
        <RestaurantFilters />
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <RestaurantResults
              defaultPage={page}
              defaultPageSize={pageSize}
              defaultView={view}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default Page;
