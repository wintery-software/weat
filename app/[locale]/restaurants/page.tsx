import { I18nProps } from '@/app/[locale]/layout';
import {
  StandardLayout,
  StandardLayoutBradcrumb,
  StandardLayoutContent,
} from '@/app/[locale]/layouts/standard_layout';
import RollPanel from '@/app/[locale]/restaurants/_roll_panel';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getS3PlacePhotoUrl } from '@/lib/aws-s3';
import { getRestaurants } from '@/lib/data';
import { Link } from '@/lib/i18n/navigation';
import { generateMetadataTitle } from '@/lib/utils';
import { Metadata } from 'next';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export const generateMetadata = async ({
  params: { locale },
}: {
  params: I18nProps;
}) => {
  const t = await getTranslations({ locale });

  return {
    title: generateMetadataTitle(t('pages.restaurants.metadata.title')),
    description: t('pages.restaurants.metadata.description'),
  } as Metadata;
};

interface PageProps {
  searchParams?: SearchParams;
}

const Page = async ({ searchParams }: PageProps) => {
  const locale = useLocale();
  const t = await getTranslations();
  const breadcrumbItems = [
    {
      name: t('pages.restaurants.metadata.title'),
    },
  ];
  const result = await getRestaurants(
    locale,
    new URLSearchParams(searchParams),
  );
  const restaurants = result.data;

  return (
    <StandardLayout>
      <StandardLayoutBradcrumb items={breadcrumbItems} />
      <StandardLayoutContent>
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
            <Card className="col-span-full md:col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {t('pages.restaurants.whatToEatToday.title')}
                </CardTitle>
                <CardDescription>
                  {t('pages.restaurants.whatToEatToday.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RollPanel items={restaurants}>
                  <Button>
                    {t('pages.restaurants.whatToEatToday.launch')}
                  </Button>
                </RollPanel>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {t('pages.restaurants.trendingRestaurants.title')}
                <Button variant="link" className="text-link p-0 h-auto" asChild>
                  <Link href="/restaurants/trending">
                    {t('pages.restaurants.trendingFood.viewMore')}
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>
                {t('pages.restaurants.trendingRestaurants.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                  {restaurants.slice(0, 10).map((r, index) => (
                    <figure
                      key={index}
                      className="flex flex-col shrink-0 gap-1 w-40 md:w-60 lg:w-80"
                    >
                      <Link href={`/restaurants/${r.id}`}>
                        <Image
                          src={getS3PlacePhotoUrl(
                            r.google_place_id,
                            r.images[0],
                            '1024x768',
                          )}
                          alt={r.name}
                          width={320}
                          height={240}
                          sizes="100vw"
                          className="aspect-auto object-cover rounded"
                        />
                      </Link>
                      <figcaption className="text-sm font-medium hover:underline truncate">
                        <Link key={index} href={`/restaurants/${r.id}`}>
                          {r.name}
                        </Link>
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {t('pages.restaurants.trendingFood.title')}
                <Button variant="link" className="text-link p-0 h-auto" asChild>
                  <Link href="/restaurants/items/trending">
                    {t('pages.restaurants.trendingFood.viewMore')}
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>
                {t('pages.restaurants.trendingFood.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                  {restaurants.slice(0, 10).map((r, index) => (
                    <figure
                      key={index}
                      className="flex flex-col shrink-0 gap-1 w-40 md:w-60 lg:w-80"
                    >
                      <Link href={`/restaurants/${r.id}`}>
                        <Image
                          src={getS3PlacePhotoUrl(
                            r.google_place_id,
                            r.images[0],
                            '400x300',
                          )}
                          alt={r.name}
                          width={320}
                          height={240}
                          sizes="100vw"
                          className="aspect-auto object-cover rounded"
                        />
                      </Link>
                      <figcaption className="text-sm font-medium hover:underline truncate">
                        <Link key={index} href={`/restaurants/${r.id}`}>
                          {r.name}
                        </Link>
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </StandardLayoutContent>
    </StandardLayout>
  );
};

export default Page;
