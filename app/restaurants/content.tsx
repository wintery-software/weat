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
import { MapPinnedIcon } from 'lucide-react';
import { Fragment } from 'react';

export default function Content({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="flex justify-center items-center w-full max-h-dvh text-muted-foreground">
        没有结果
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-full">
      <div className="prose mb-8">
        <h2>离你最近的餐厅</h2>
      </div>
      {restaurants.map((r, index) => (
        <Fragment key={r.name}>
          <Card className="border-0 rounded-none shadow-none hover:shadow transition-shadow flex">
            <Carousel>
              <CarouselContent>
                {r.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image}
                      className="object-cover min-w-48 w-48 min-h-48 h-48"
                      alt={`${r.name}-${index}`}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            <a href={r.googleMapsUrl} className="h-48">
              <CardHeader>
                <CardTitle className="text-xl">{r.name}</CardTitle>
                <div className="flex gap-2">
                  <Rating value={r.rating} toggleable={false} />
                  <p className="text-sm font-semibold">{r.rating}</p>
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
      ))}
    </div>
  );
}
