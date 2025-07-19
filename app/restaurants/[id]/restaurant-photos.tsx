"use client";

import { type RestaurantData } from "@/app/api/restaurants/[id]/route";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface RestaurantPhotosProps {
  restaurant: RestaurantData;
}

export const RestaurantPhotos = ({ restaurant }: RestaurantPhotosProps) => (
  <Card className="border-none p-0">
    <CardContent className="relative p-0">
      {/* Carousel for mobile */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {Array.from({ length: 8 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="group relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg"
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
      <div className="hidden gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src="/placeholder.svg"
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
