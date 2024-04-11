import {
  StandardLayout,
  StandardLayoutBradcrumb,
  StandardLayoutContent,
} from '@/app/[locale]/layouts/standard_layout';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getRestaurants } from '@/lib/data';
import { Link } from '@/lib/i18n/navigation';
import { generateMetadataTitle } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: generateMetadataTitle(
      t('pages.restaurants.trendingRestaurants.title'),
    ),
  };
};

interface PageProps {
  searchParams: { page: number };
}

const Page = async ({ searchParams: { page } }: PageProps) => {
  page = Number(page) || 1;

  const locale = useLocale();
  const t = await getTranslations();
  const breadcrumbItems = [
    {
      name: t('pages.restaurants.metadata.title'),
      url: '/restaurants',
    },
    {
      name: t('pages.restaurants.trendingRestaurants.title'),
    },
  ];
  const result = await getRestaurants(
    locale,
    new URLSearchParams({ page: page.toString() }),
  );
  const restaurants = result.data;
  const pageSize = result.page_size;
  const lastPage = Math.ceil(result.total / pageSize);

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1)
    .map((p) =>
      p === 1 || p === lastPage || Math.abs(p - page) < 2 ? p : null,
    )
    .reduce(
      (acc, p) => {
        if (p) {
          acc.push(p);
        } else if (acc[acc.length - 1] !== null) {
          acc.push(null);
        }

        return acc;
      },
      [] as (number | null)[],
    );

  return (
    <StandardLayout>
      <StandardLayoutBradcrumb items={breadcrumbItems} />
      <StandardLayoutContent>
        <Card>
          <CardHeader>
            <CardTitle>
              {t('pages.restaurants.trendingRestaurants.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              {restaurants.map((restaurant) => (
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  key={restaurant.id}
                  id={restaurant.id}
                  className="rounded-md p-4 hover:bg-stone-100"
                >
                  <p className="text-sm font-bold">{restaurant.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {restaurant.address}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Pagination>
              <PaginationContent>
                {page !== 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={page === 2 ? '?' : `?page=${page - 1}`}
                    />
                  </PaginationItem>
                )}
                {pages.map((p) =>
                  p ? (
                    <PaginationItem key={p}>
                      <PaginationLink href={`?page=${p}`} isActive={p === page}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ),
                )}
                {page !== lastPage && (
                  <PaginationItem>
                    <PaginationNext href={`?page=${page + 1}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </StandardLayoutContent>
    </StandardLayout>
  );
};

export default Page;
