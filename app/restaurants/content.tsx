import Rating from '@/components/rating';
import { Badge } from '@/components/ui/badge';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Loader2Icon, MapPinnedIcon } from 'lucide-react';
import { Fragment } from 'react';

export default function Content({
  restaurants,
  loading,
}: {
  restaurants: Restaurant[];
  loading: boolean;
}) {
  const render = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-4">
          <Loader2Icon className="h-6 w-6 animate-spin" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      );
    }

    if (!restaurants || restaurants.length === 0) {
      return (
        <div className="flex items-center justify-center">
          <span>没有结果</span>
        </div>
      );
    }

    return restaurants.map((r, index) => (
      <Fragment key={r.name}>
        <Card className="border-0 rounded-none shadow-none hover:shadow transition-shadow flex">
          <Carousel className="w-48 h-48">
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
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          <a href={r.googleMapsUrl}>
            <CardHeader>
              <CardTitle className="text-xl">{r.name}</CardTitle>
              <div className="flex gap-2">
                <Rating value={r.rating} toggleable={false} />
                <p className="text-sm font-semibold">{r.rating.toFixed(1)}</p>
              </div>
              <div className="flex gap-1">
                {r.categories.map((c, index) => (
                  <Badge key={index} variant="secondary" className="px-2">
                    {c}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardFooter>
              <div className="flex gap-1 items-center text-xs">
                <MapPinnedIcon className="w-4 h-4" />
                <span className="text-muted-foreground hover:underline">
                  {r.address}
                </span>
              </div>
            </CardFooter>
          </a>
        </Card>
        <Separator />
      </Fragment>
    ));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="prose mb-8">
        <h2>评分最高的餐厅</h2>
      </div>
      {render()}
    </div>
  );
}
