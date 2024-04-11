import { I18nProps } from '@/app/[locale]/layout';
import {
  StandardLayout,
  StandardLayoutBradcrumb,
  StandardLayoutContent,
  StandardLayoutHeader,
} from '@/app/[locale]/layouts/standard_layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getRestaurant, getRestaurantItems } from '@/lib/data';
import { Link } from '@/lib/i18n/navigation';
import { toWeekday, withinTimeRange } from '@/lib/i18n/utils/date';
import { generateMetadataTitle } from '@/lib/utils';
import { IconPhotoQuestion } from '@tabler/icons-react';
import { Metadata } from 'next';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

const businessHours: ([string, string] | null)[] = [
  null,
  ['11:00', '21:00'],
  ['11:00', '21:00'],
  ['11:00', '21:00'],
  ['11:00', '21:00'],
  ['11:00', '21:00'],
  null,
];

export const generateMetadata = async ({
  params: { id, locale },
}: {
  params: { id: string } & I18nProps;
}) => {
  const restaurant = await getRestaurant(id, locale);
  const t = await getTranslations({ locale });

  return {
    title: generateMetadataTitle(restaurant.name),
    description: t('pages.restaurants.metadata.description'),
  } as Metadata;
};

const Page = async ({ params }: { params: { id: string } }) => {
  const locale = useLocale();
  const restaurant = await getRestaurant(params.id, locale);
  const items = await getRestaurantItems(params.id, locale);
  const t = await getTranslations();
  const breadcrumbItems = [
    { name: t('pages.restaurants.metadata.title'), url: '/restaurants' },
    { name: restaurant.name, url: `/restaurants/${restaurant.id}` },
  ];
  const isOpen = withinTimeRange(businessHours);

  return (
    <StandardLayout>
      <StandardLayoutBradcrumb items={breadcrumbItems} />
      <StandardLayoutHeader
        title={restaurant.name}
        status={
          isOpen ? (
            <Badge variant="outline">{t(`pages.restaurant.status.open`)}</Badge>
          ) : (
            <Badge variant="destructive">
              {t(`pages.restaurant.status.closed`)}
            </Badge>
          )
        }
      />
      <StandardLayoutContent>
        <div className="flex flex-col gap-2 md:gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {t('pages.restaurant.menu.popularDishes')}
                <Button variant="link" asChild className="text-link p-0 h-auto">
                  <Link
                    href={`/restaurants/${params.id}/menu`}
                    className="hover:underline text-sm text-link"
                  >
                    {t('pages.restaurants.trendingFood.viewMore')}
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                  {items.slice(0, 10).map((r, index) => (
                    <figure
                      key={index}
                      className="flex flex-col shrink-0 gap-1 w-40 h-30"
                    >
                      {r.image ? (
                        <img
                          src={r.image}
                          alt={r.name}
                          className="aspect-[4/3] object-cover rounded-md"
                        />
                      ) : (
                        <div
                          className={`flex items-center justify-center aspect-[4/3] rounded-md`}
                        >
                          <IconPhotoQuestion />
                        </div>
                      )}
                      <figcaption className="text-sm font-medium hover:underline truncate">
                        {r.name}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="grid gap-2 md:gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('pages.restaurant.businessHours')}</CardTitle>
              </CardHeader>
              <CardContent>
                {businessHours.map((hours, index) => (
                  <div
                    key={index}
                    className="flex justify-between hover:bg-stone-100 transition-all px-2 py-0.5 rounded"
                  >
                    <span className="font-medium">
                      {toWeekday(index, locale)}
                    </span>
                    <span>
                      {hours
                        ? `${hours[0]} - ${hours[1]}`
                        : t(`pages.restaurant.status.closed`)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('pages.restaurant.location.title')}</CardTitle>
              </CardHeader>
              <CardContent>{restaurant.address}</CardContent>
            </Card>
          </div>
        </div>
      </StandardLayoutContent>
    </StandardLayout>
  );
};

export default Page;
