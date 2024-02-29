import Rating from '@/components/rating';
import SortSelect from '@/components/sort_select';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { RestaurantSortFieldsType, SortOrdersType } from '@/lib/constants';
import { isGoogleMapsApiEnabled } from '@/lib/google_maps';
import { isEmpty } from 'lodash';
import { ClockIcon, Loader2Icon, MapPinnedIcon, RouteIcon } from 'lucide-react';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';

const sortFields: RestaurantSortFieldsType = {
  rating: '评分',
  price: '价格',
  distance: '距离',
};

const titleDescriptor: Record<string, string> = {
  'rating:asc': '最不受欢迎',
  'rating:desc': '最受欢迎',
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
}: {
  restaurants: Restaurant[];
  loading: boolean;
  sortBy: [keyof RestaurantSortFieldsType, keyof SortOrdersType];
  setSortBy: Dispatch<
    SetStateAction<[keyof RestaurantSortFieldsType, keyof SortOrdersType]>
  >;
}) {
  const [title, setTitle] = useState<string>('RTP 餐厅');

  if (!isGoogleMapsApiEnabled()) {
    delete sortFields.distance;
  }

  useEffect(() => {
    const adjective = titleDescriptor[sortBy.join(':')];

    setTitle(`${adjective}的餐厅`);
  }, [sortBy]);

  const render = () => {
    if (!loading && isEmpty(restaurants)) {
      return (
        <div className="flex items-center justify-center">
          <span className="text-muted-foreground">没有结果</span>
        </div>
      );
    }

    return restaurants.map((r, index) => (
      <Fragment key={r.name}>
        <Card className="border-0 rounded-none shadow-none hover:shadow transition-shadow flex">
          <Carousel>
            <CarouselContent>
              {r.images.map((image, index) => (
                <CarouselItem key={index} className="w-48 h-48">
                  <img
                    src={image}
                    className="object-cover w-full h-full"
                    alt={`${r.name}-${index}`}
                    width="100%"
                    height="100%"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/*<CarouselPrevious className="left-2" />*/}
            {/*<CarouselNext className="right-2" />*/}
          </Carousel>
          <a href={r.googleMapsUrl} target="_blank">
            <CardHeader>
              <CardTitle>{r.name}</CardTitle>
              <div className="flex gap-2 items-center">
                <Rating value={r.rating} toggleable={false} />
                <span className="text-sm font-semibold">
                  {r.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {'$'.repeat(r.price)}
                </span>
              </div>
              <div className="flex gap-1">
                {r.categories.map((c, index) => (
                  <Badge key={index} variant="secondary" className="px-2">
                    {c}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 text-xs text-muted-foreground">
                <span className="flex gap-1 items-center">
                  <MapPinnedIcon size={12} />
                  <span className="hover:underline">{r.address}</span>
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
      </Fragment>
    ));
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col md:flex-row ">
        <div className="flex prose gap-4">
          <h1 className="mb-0">{title}</h1>
          {loading && (
            <Loader2Icon className="animate-spin self-center" size={24} />
          )}
        </div>
        <div className="md:self-center md:ml-auto">
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
