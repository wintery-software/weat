'use client';

import {
  StandardLayout,
  StandardLayoutBradcrumb,
  StandardLayoutContent,
  StandardLayoutDescription,
  StandardLayoutHeader,
  StandardLayoutTitle,
} from '@/app/layouts/standard_layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getPlaceUrl } from '@/lib/google-maps';
import { Restaurant, RestaurantItem } from '@prisma/client';
import { Text } from '@radix-ui/themes';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { toast } from 'sonner';
import useSWR from 'swr';

interface RestaurantReturnType extends Restaurant {
  categories: string[];
  items: Record<string, RestaurantItem[]>;
}

const useRestaurant = (id: string) => {
  const { data, error, isLoading } = useSWR<RestaurantReturnType>(
    `/restaurants/${id}`,
  );

  return {
    restaurant: data,
    error,
    isLoading,
  };
};

const Page = ({ params }: { params: { id: string } }) => {
  const { restaurant, error, isLoading } = useRestaurant(params.id);

  if (error) {
    toast.error('餐厅加载失败', {
      description: error.info.error,
    });
  }

  return (
    <StandardLayout>
      <StandardLayoutHeader>
        <StandardLayoutBradcrumb
          parents={[{ name: '餐厅', url: '/restaurants' }]}
          current={restaurant?.name}
        />
        <div>
          <StandardLayoutTitle isLoading={isLoading || error}>
            {restaurant?.name}
          </StandardLayoutTitle>
          <StandardLayoutDescription isLoading={isLoading || error}>
            <Link
              href={
                restaurant
                  ? getPlaceUrl(restaurant.address, restaurant.placeId)
                  : ''
              }
              className="hover:underline"
              title="在 Google 地图中打开"
              target="_blank"
            >
              {restaurant?.address}
            </Link>
          </StandardLayoutDescription>
        </div>
      </StandardLayoutHeader>
      <StandardLayoutContent isLoading={isLoading || error}>
        {isEmpty(restaurant?.items) ? (
          <p className="text-sm md:text-md py-3">
            暂无数据。商家可联系
            <Link
              href={
                restaurant
                  ? `mailto:admin@wintery.io?subject=添加餐厅菜单: ${encodeURIComponent(restaurant.name)}`
                  : ''
              }
              className="text-sky-500 hover:underline"
            >
              管理员
            </Link>
            添加。
          </p>
        ) : (
          <Accordion
            type="multiple"
            // defaultValue={Object.keys(restaurant.items)}
          >
            {Object.entries(restaurant.items).map(
              ([category, categoryItems], index) => {
                return (
                  <AccordionItem value={category} key={index}>
                    <AccordionTrigger>
                      <Text size="3" weight="bold">
                        {category} ({categoryItems.length})
                      </Text>
                    </AccordionTrigger>
                    <AccordionContent className="divide-y divide-gray-200">
                      {categoryItems.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col gap-0.5 py-3"
                          >
                            <Text size="2" weight="bold">
                              {item.name}
                              {item.nameZh && ` (${item.nameZh})`}
                            </Text>
                            {item.description && <p>{item.description}</p>}
                            <Text size="1" color="gray">
                              ${item.price.toString()}
                            </Text>
                          </div>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                );
              },
            )}
          </Accordion>
        )}
      </StandardLayoutContent>
    </StandardLayout>
  );
};

export default Page;
