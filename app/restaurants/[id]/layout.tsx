import { RestaurantSkeleton } from "@/app/restaurants/[id]/restaurant-skeleton";
import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { api } from "@/lib/api";
import { PropsWithChildren } from "react";

const title = "餐厅详情";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  try {
    const { data: restaurant } = await api.get(`/restaurants/${id}`);

    const metadataTitle =
      (restaurant.name_zh || restaurant.name_en) + ` - ${title} - 餐厅`;

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

const Page = async ({ children }: PropsWithChildren) => (
  <SuspenseWrapper fallback={<RestaurantSkeleton />}>
    {children}
  </SuspenseWrapper>
);

export default Page;
