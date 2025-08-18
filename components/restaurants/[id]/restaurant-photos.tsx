"use client";

import { type GetRestaurantResponse } from "@/app/restaurants/[id]/actions";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getRestaurantImageUrl } from "@/lib/image-utils";
import Image from "next/image";

interface RestaurantPhotosProps {
  restaurant: GetRestaurantResponse;
}

export const RestaurantPhotos = ({ restaurant }: RestaurantPhotosProps) => (
  <Card className="border-none p-0">
    <CardContent className="relative p-0">
      {/* Carousel for mobile */}
      <div className="flex flex-col gap-2 sm:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {restaurant.images?.map((image, index) => (
              <CarouselItem key={index}>
                <div className="group relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={getRestaurantImageUrl(restaurant.id, image)}
                    alt={`${restaurant.name_zh || restaurant.name_en || "-"} photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant={"ghost"}
            className="absolute top-1/2 left-0 z-10 h-full w-12 -translate-y-1/2 rounded-none disabled:hidden data-[state=disabled]:hidden"
          />
          <CarouselNext
            variant={"ghost"}
            className="absolute top-1/2 right-0 z-10 h-full w-12 -translate-y-1/2 rounded-none disabled:hidden data-[state=disabled]:hidden"
          />
        </Carousel>
      </div>

      {/* Grid for larger screens */}
      <div className="hidden gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {restaurant.images?.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={getRestaurantImageUrl(restaurant.id, image)}
              alt={`${restaurant.name_zh || restaurant.name_en || "-"} photo ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
