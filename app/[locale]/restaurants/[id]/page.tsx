import {
  StandardLayout,
  StandardLayoutBradcrumb,
  StandardLayoutContent,
  StandardLayoutContentSection,
  StandardLayoutDescription,
  StandardLayoutHeader,
  StandardLayoutTitle,
} from '@/app/[locale]/layouts/standard_layout';
import { Button } from '@/components/ui/button';
import { getPlaceUrl } from '@/lib/google-maps';
import { getLocaleHourMinute, getLocaleWeekdaysString } from '@/lib/i18n/time';
import { getWeatApiUrl } from '@/lib/utils';
import { IconExternalLink, IconNotebook } from '@tabler/icons-react';
import Link from 'next/link';

const useRestaurant = async (id: string) => {
  const res = await fetch(getWeatApiUrl(`/restaurants/${id}`));

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

const businessHours = {
  '1': ['11:00', '21:00'],
  '2': ['11:00', '21:00'],
  '3': ['11:00', '21:00'],
  '4': ['11:00', '21:00'],
  '5': ['11:00', '21:00'],
  '6': ['11:00', '21:00'],
  '7': ['11:00', '21:00'],
};

const Page = async ({ params }: { params: { id: string } }) => {
  const restaurant = await useRestaurant(params.id);

  return (
    <StandardLayout>
      <StandardLayoutHeader>
        <StandardLayoutBradcrumb
          parents={[{ name: '餐厅', url: '/restaurants' }]}
          current={restaurant?.name}
        />
        <StandardLayoutTitle>{restaurant.name}</StandardLayoutTitle>
        <StandardLayoutDescription>
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
            {restaurant.address}
          </Link>
        </StandardLayoutDescription>
      </StandardLayoutHeader>
      <StandardLayoutContent>
        <div className="divide-y">
          <StandardLayoutContentSection title="菜单">
            <div className="flex gap-1">
              <Button asChild className="flex gap-1">
                <Link href={restaurant.url || '#'}>
                  <IconExternalLink size={16} />
                  查看商家网站
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex gap-1">
                <Link href={`/restaurants/${restaurant.id}/menu`}>
                  <IconNotebook size={16} />
                  查看菜单
                </Link>
              </Button>
            </div>
          </StandardLayoutContentSection>
          <StandardLayoutContentSection title="营业信息">
            <div className="flex flex-col gap-2">
              {Object.entries(businessHours).map(([day, hours]) => {
                const weekday = getLocaleWeekdaysString('zh-CN');

                return (
                  <div
                    key={day}
                    className="flex justify-between hover:bg-stone-200 transition-all px-1 rounded"
                  >
                    <span className="font-bold">
                      {weekday[day as keyof typeof weekday]}
                    </span>
                    <span>
                      {hours.map((h) => getLocaleHourMinute(h)).join(' - ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </StandardLayoutContentSection>
        </div>
      </StandardLayoutContent>
    </StandardLayout>
  );
};

export default Page;
