import ItemLayout from '@/app/layouts/item_layout';
import { Separator } from '@/components/ui/separator';
import { getPlaceUrl } from '@/lib/google-maps';
import { fetchWeatApi } from '@/lib/utils';
import { RestaurantItem } from '@prisma/client';
import { isEmpty } from 'lodash';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const restaurant: Restaurant = await fetchWeatApi(
    `/restaurants/${params.id}`,
  );

  const items: Record<string, RestaurantItem[]> = await fetchWeatApi(
    `/restaurants/${params.id}/items`,
    undefined,
    { cache: 'no-store' },
  );

  if (!restaurant) {
    notFound();
  }

  return (
    <ItemLayout
      breadcrumbParents={[{ name: '餐厅', url: '/restaurants' }]}
      breadcrumbCurrent={restaurant.name}
    >
      <div className="pb-4 md:pb-8">
        <h1>{restaurant.name}</h1>
        <a
          href={getPlaceUrl(restaurant.address, restaurant.placeId)}
          className="text-xs text-muted-foreground hover:underline"
          title="在 Google 地图中打开"
          target="_blank"
        >
          {restaurant.address}
        </a>
      </div>
      <div>
        <h2 className="py-3">菜单</h2>
        {isEmpty(items) ? (
          <p className="text-sm md:text-md py-3">
            暂无数据。商家可联系
            <a
              href={`mailto:admin@wintery.io?subject=添加餐厅菜单: ${encodeURIComponent(restaurant.name)}`}
              className="text-sky-500 hover:underline"
            >
              管理员
            </a>
            添加。
          </p>
        ) : (
          Object.entries(items).map(([category, categoryItems], index) => {
            return (
              <div key={index}>
                <h3 className="py-3">
                  {category} ({categoryItems.length})
                </h3>
                <div className="flex flex-col gap-2">
                  {categoryItems.map((item) => {
                    return (
                      <div key={item.id}>
                        <div className="py-2 flex flex-col gap-0.5">
                          <p className="text-sm md:text-md font-semibold">
                            {item.name}
                            {item.altName && ` (${item.altName})`}
                          </p>
                          {item.description && <p>{item.description}</p>}
                          <p className="text-xs md:text-sm">
                            ${item.price.toString()}
                          </p>
                        </div>
                        <Separator />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </ItemLayout>
  );
}
