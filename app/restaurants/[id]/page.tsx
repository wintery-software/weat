import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { getRestaurant } from "@/lib/api/restaurant";
import { APP_NAME } from "@/lib/constants";
import { Suspense } from "react";
import { RestaurantContent } from "./restaurant-content";

const title = "餐厅详情";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  try {
    const restaurant = await getRestaurant(id);

    const metadataTitle =
      (restaurant.name_zh || restaurant.name_en) + ` - ${title} - ${APP_NAME}`;

    const description = restaurant.summary?.summary
      ? restaurant.summary.summary.slice(0, 160) + "..."
      : "餐厅详情";

    return {
      title: metadataTitle,
      description,
      openGraph: {
        title: metadataTitle,
        description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: metadataTitle,
        description,
      },
    };
  } catch {
    return {
      metadataTitle: "餐厅详情",
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
