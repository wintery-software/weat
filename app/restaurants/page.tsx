import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { RestaurantResult } from "@/components/restaurants/restaurant-result";
import { APP_NAME } from "@/lib/constants";
import { type Metadata } from "next";

const title = "发现餐厅";
const description = "发现你附近的餐厅，并查看它们的评价和评分。";

export const metadata: Metadata = {
  title: `${title} - ${APP_NAME}`,
  description,
  openGraph: { title: `${title} - ${APP_NAME}`, description, type: "website" },
  twitter: { card: "summary", title: `${title} - ${APP_NAME}`, description },
};

const Page = () => {
  return (
    <div className="container flex flex-col py-2 md:py-4">
      <div>
        <h1>{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          {description}
        </p>
      </div>
      <SuspenseWrapper>
        <RestaurantResult />
      </SuspenseWrapper>
    </div>
  );
};

export default Page;
