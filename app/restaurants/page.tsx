import { RestaurantFilters } from "@/app/restaurants/restaurant-filters";
import { RestaurantResults } from "@/app/restaurants/restaurant-results";
import { ErrorBoundary } from "@/components/error-boundary";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

const title = "发现餐厅";
const description = "发现你附近的餐厅，并查看它们的评价和评分。";

export const metadata: Metadata = {
  title: `${title} - ${APP_NAME}`,
  description,
  openGraph: { title: `${title} - ${APP_NAME}`, description, type: "website" },
  twitter: { card: "summary", title: `${title} - ${APP_NAME}`, description },
};

const Page = async () => {
  return (
    <div className="container flex flex-col gap-4 py-4 md:gap-6 md:py-8">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          {description}
        </p>
      </div>
      <ErrorBoundary>
        <RestaurantFilters />
        <RestaurantResults />
      </ErrorBoundary>
    </div>
  );
};

export default Page;
