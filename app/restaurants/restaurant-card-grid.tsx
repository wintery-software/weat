"use client";

import { Rating } from "@/components/rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Restaurant } from "@/types/restaurant";
import { Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";

interface RestaurantCardGridProps {
  restaurant: Restaurant;
}

export const RestaurantCardGrid = ({ restaurant }: RestaurantCardGridProps) => {
  const formatAddress = (address: Restaurant["address"]) => {
    return `${address.address1}, ${address.city}, ${address.state} ${address.zipcode}`;
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden py-0">
      <div className="flex flex-1 flex-col">
        <div
          className="h-48 w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(/placeholder.svg)`,
            backgroundColor: "#f3f4f6",
          }}
        />
        <CardContent className="flex-1 p-4">
          <div className="mb-1">
            <h3 className="font-bold">
              <Link
                href={`/restaurants/${restaurant.id}`}
                className="hover:underline"
              >
                {restaurant.name}
              </Link>
            </h3>
          </div>
          <div className="text-muted-foreground mt-2 text-xs">
            <a
              href={restaurant.externalLinks.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors hover:underline"
            >
              {formatAddress(restaurant.address)}
            </a>
          </div>
          <div className="mt-2 flex items-center">
            <span className="mr-1 text-sm font-medium">
              {restaurant.summary.sentimentScore}
            </span>
            <div className="flex">
              <Rating value={restaurant.summary.sentimentScore} size={12} />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {restaurant.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-1">
              <ThumbsUp className="size-4 text-green-500" />
              <div className="text-xs">
                <span className="font-medium">优点: </span>
                <span className="text-muted-foreground">
                  {restaurant.summary.aspects.taste.join(", ")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-1">
              <ThumbsDown className="size-4 text-red-500" />
              <div className="text-xs">
                <span className="font-medium">缺点: </span>
                <span className="text-muted-foreground">
                  {restaurant.summary.aspects.service.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex w-full gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
            >
              <Link href={`/restaurants/${restaurant.id}`}>View Details</Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent"
            >
              <Share2 className="mr-1 size-4" />
              Share
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};
