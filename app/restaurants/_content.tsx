import { RestaurantType } from '@/app/restaurants/page';
import Rating from '@/components/rating';
import { Badge } from '@/components/ui/badge';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { getS3PlacePhotoUrl } from '@/lib/aws-s3';
import { getPlaceUrl } from '@/lib/google-maps';
import { ClockIcon, RouteIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Content = ({ restaurants }: { restaurants: RestaurantType[] }) => (
  <div>
    {restaurants.map((r, index) => (
      <Card
        key={index}
        className="border-0 border-b rounded-none shadow-none hover:bg-white hover:shadow transition-all flex p-2 md:p-4 bg-gray-50"
      >
        <Carousel>
          <CarouselContent className="w-[160px] h-[120px]">
            {r.images.map((ref, index) => {
              const url = getS3PlacePhotoUrl(r.placeId, ref);
              return (
                <CarouselItem key={index}>
                  <Image
                    src={url}
                    loader={() => url}
                    className="object-cover w-full h-full rounded-md"
                    alt={`${r.name}-${index}`}
                    width={512}
                    height={512}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        <Link
          href={`/restaurants/${r.id}`}
          key={r.placeId}
          title="查看详细信息"
        >
          <CardHeader className="pt-0 pb-3 md:pb-6">
            <CardTitle className="leading-5 text-sm md:text-base hover:underline">
              {r.name}
              {r.nameZh && `(${r.nameZh})`}
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
            <div className="flex flex-wrap gap-1">
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
                <Link
                  href={getPlaceUrl(r.address, r.placeId)}
                  className="underline"
                  title="在 Google Maps 中打开"
                  target="_blank"
                >
                  {r.address}
                </Link>
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
        </Link>
      </Card>
    ))}
  </div>
);

export default Content;
