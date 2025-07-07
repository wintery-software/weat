import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { fetchRestaurant } from "@/lib/api/restaurant";
import { Suspense } from "react";
import { RestaurantContent } from "./restaurant-content";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  try {
    const restaurant = await fetchRestaurant(id);

    const title =
      (restaurant.name_zh || restaurant.name_en) + " - 餐厅详情 - Weat";

    const description = restaurant.summary?.summary
      ? restaurant.summary.summary.slice(0, 160) + "..."
      : "餐厅详情";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch {
    return {
      title: "餐厅详情",
      description: "餐厅详情",
    };
  }
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <RestaurantContent id={id} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Page;
