import Rating from '@/components/rating';
import SortSelect from '@/components/sort_select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { getS3PlacePhotoUrl } from '@/lib/aws-s3';
import { RestaurantSortFieldsType, SortOrdersType } from '@/lib/constants';
import { getPlaceUrl, isGoogleMapsApiEnabled } from '@/lib/google-maps';
import { isEmpty } from 'lodash';
import { ClockIcon, FilterIcon, Loader2Icon, RouteIcon } from 'lucide-react';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';

const sortFields: RestaurantSortFieldsType = {
  rating: '评分',
  price: '价格',
  distance: '距离',
};

const titleDescriptor: Record<string, string> = {
  'rating:asc': '评分最低',
  'rating:desc': '评分最高',
  'price:asc': '价格最低',
  'price:desc': '价格最高',
  'distance:asc': '离我最近的',
  'distance:desc': '离我最远的',
};

export default function Content({
  restaurants,
  loading,
  sortBy,
  setSortBy,
  setSidebarOpen,
}: {
  restaurants: Restaurant[];
  loading: boolean;
  sortBy: [keyof RestaurantSortFieldsType, keyof SortOrdersType];
  setSortBy: Dispatch<
    SetStateAction<[keyof RestaurantSortFieldsType, keyof SortOrdersType]>
  >;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [title, setTitle] = useState<string>('RTP 餐厅');

  if (!isGoogleMapsApiEnabled()) {
    delete sortFields.distance;
  }

  useEffect(() => {
    const adjective = titleDescriptor[sortBy.join(':')];

    setTitle(`RTP ${adjective}的餐厅`);
  }, [sortBy]);

  const render = () => {
    if (!loading && isEmpty(restaurants)) {
      return (
        <div className="flex items-center justify-center">
          <span className="text-muted-foreground">没有结果</span>
        </div>
      );
    }

    return restaurants.map((r) => (
      <>
        <Card className="border-0 rounded-none shadow-none hover:shadow transition-shadow flex p-2 md:p-4">
          <Carousel>
            <CarouselContent className="w-[160px] h-[120px]">
              {r.images.map((ref, index) => (
                <CarouselItem key={index}>
                  <img
                    src={getS3PlacePhotoUrl(r.placeId, ref)}
                    className="object-cover w-full h-full rounded-md"
                    alt={`${r.name}-${index}`}
                    width="100%"
                    height="100%"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <a href={`/restaurants/${r.id}`} key={r.placeId} title="查看详细信息">
            <CardHeader className="pt-0 pb-3 md:pb-6">
              <CardTitle className="leading-5 text-sm md:text-base hover:underline">
                {r.name} {r.altName && `(${r.altName})`}
              </CardTitle>
              <div className="flex gap-2 items-center">
                {r.rating && (
                  <>
                    <Rating value={r.rating} toggleable={false} size={14} />
                    <span className="text-xs md:text-sm font-semibold">
                      {r.rating.toFixed(1)}
                    </span>
                  </>
                )}
                {r.price && (
                  <span className="text-xs text-muted-foreground">
                    {'$'.repeat(r.price)}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {r.categories.map((c, index) => (
                  <Badge key={index} variant="secondary" className="px-2">
                    {c}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardFooter className="pb-0">
              <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 text-xs text-muted-foreground">
                <span className="flex gap-1 items-center">
                  <a
                    href={getPlaceUrl(r.address, r.placeId)}
                    className="underline"
                    title="在 Google Maps 中打开"
                    target="_blank"
                  >
                    {r.address}
                  </a>
                </span>
                {r.distance && (
                  <>
                    <span className="flex gap-1 items-center">
                      <RouteIcon size={12} />
                      {r.distance.distance.toFixed(1)} mi
                    </span>
                    <span className="flex gap-1 items-center">
                      <ClockIcon size={12} />
                      {r.distance.duration.toFixed(0)} min
                    </span>
                  </>
                )}
              </div>
            </CardFooter>
          </a>
        </Card>
        <Separator />
      </>
    ));
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          <h1 className="text-xl md:text-2xl font-semibold self-center">
            {title}
          </h1>
          {loading && (
            <Loader2Icon className="animate-spin self-center" size={16} />
          )}
        </div>
        <div className="md:self-center md:ml-auto flex gap-1">
          <Button
            className="flex md:hidden"
            variant="outline"
            size="icon"
            onClick={() => {
              setSidebarOpen(true);
            }}
          >
            <FilterIcon size={14} />
          </Button>
          <SortSelect
            sortFields={sortFields as unknown as Record<string, string>}
            sortBy={sortBy}
            setSortBy={
              setSortBy as Dispatch<
                SetStateAction<[string, keyof SortOrdersType]>
              >
            }
          />
        </div>
      </div>
      <div>{render()}</div>
    </div>
  );
}
