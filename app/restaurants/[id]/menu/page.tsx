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
import { getWeatApiUrl } from '@/lib/utils';
import { Restaurant, RestaurantItem } from '@prisma/client';
import { isEmpty } from 'lodash';
import { LoremIpsum } from 'lorem-ipsum';
import Link from 'next/link';

interface RestaurantReturnType extends Restaurant {
  categories: string[];
  items: Record<string, RestaurantItem[]>;
}

const useRestaurant = async (id: string): Promise<RestaurantReturnType> => {
  const res = await fetch(getWeatApiUrl(`/restaurants/${id}`));

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

const Page = async ({ params }: { params: { id: string } }) => {
  const restaurant = await useRestaurant(params.id);

  return (
    <StandardLayout>
      <StandardLayoutHeader>
        <StandardLayoutBradcrumb
          parents={[
            { name: '餐厅', url: '/restaurants' },
            { name: restaurant.name, url: `/restaurants/${restaurant.id}` },
          ]}
          current="菜单"
        />
        <StandardLayoutTitle>{restaurant.name}</StandardLayoutTitle>
        <StandardLayoutDescription>
          <Link
            href={getPlaceUrl(restaurant.address, restaurant.placeId)}
            className="hover:underline"
            title="在 Google 地图中打开"
            target="_blank"
          >
            {restaurant.address}
          </Link>
        </StandardLayoutDescription>
      </StandardLayoutHeader>
      <StandardLayoutContent>
        {isEmpty(restaurant.items) ? (
          <p className="text-sm md:text-md py-3">
            暂无数据。商家可联系
            <Link
              href={`mailto:admin@wintery.io?subject=添加餐厅菜单: ${encodeURIComponent(restaurant.name)}`}
              className="text-sky-500 hover:underline"
            >
              管理员
            </Link>
            添加。
          </p>
        ) : (
          <>
            <p className="text-gray-500 text-xs mb-4">
              菜单内容有误？
              <Link
                href="mailto:support@wintery.io"
                className="text-link hover:underline"
              >
                提交更改
              </Link>
              。
            </p>
            <Accordion
              type="multiple"
              defaultValue={Object.keys(restaurant.items)}
            >
              {Object.entries(restaurant.items).map(
                ([category, categoryItems], index) => {
                  return (
                    <AccordionItem value={category} key={index}>
                      <AccordionTrigger>
                        <p className="text-lg font-bold">
                          {category} ({categoryItems.length})
                        </p>
                      </AccordionTrigger>
                      <AccordionContent className="divide-y divide-gray-200">
                        {categoryItems.map((item) => {
                          return (
                            <div key={item.id} className="flex py-3">
                              <div className="flex-1 flex flex-col gap-1 min-w-0 pr-8">
                                <p className="font-bold">
                                  {item.name}
                                  {item.nameZh && ` (${item.nameZh})`}
                                </p>
                                <p className="text-xs text-gray-500 break-words">
                                  {item.description ||
                                    new LoremIpsum().generateSentences(1)}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <p className="font-bold">
                                  ${item.price.toString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  );
                },
              )}
            </Accordion>
          </>
        )}
      </StandardLayoutContent>
    </StandardLayout>
  );
};

export default Page;
