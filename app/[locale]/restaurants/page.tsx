import { I18nProps } from '@/app/[locale]/layout';
import {
  StandardLayout,
  StandardLayoutBradcrumb,
  StandardLayoutContent,
} from '@/app/[locale]/layouts/standard_layout';
import RollPanel from '@/app/[locale]/restaurants/_roll_panel';
import ImageGallery from '@/components/image_gallery';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getRestaurants } from '@/lib/data';
import { Link } from '@/lib/i18n/navigation';
import { generateMetadataTitle } from '@/lib/utils';
import { Metadata } from 'next';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

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
              <ImageGallery
                images={restaurants.slice(0, 10).map((r) => ({
                  src: r.images[0],
                  alt: r.name,
                  href: `/restaurants/${r.id}`,
                }))}
              />
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
              <ImageGallery
                images={restaurants.slice(0, 10).map((r) => ({
                  src: r.images[0],
                  alt: r.name,
                  href: `/restaurants/${r.id}`,
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </StandardLayoutContent>
    </StandardLayout>
  );
};

export default Page;
