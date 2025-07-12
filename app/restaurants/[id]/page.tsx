import { RestaurantData } from "@/app/api/restaurants/[id]/route";
import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { api } from "@/lib/api";
import { RestaurantContent } from "./restaurant-content";

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

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { data: restaurant } = await api.get<RestaurantData>(
    `/restaurants/${id}`,
  );

  return (
    <SuspenseWrapper>
      <RestaurantContent restaurant={restaurant} />
    </SuspenseWrapper>
  );
};

export default Page;
