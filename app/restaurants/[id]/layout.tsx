import { api } from "@/lib/api";
import { type PropsWithChildren } from "react";

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
      title: "餐厅详情",
      description: "餐厅详情",
    };
  }
};

const Layout = async ({ children }: PropsWithChildren) => <>{children}</>;

export default Layout;
