"use client";

import { RestaurantsGETResponse } from "@/app/api/restaurants/route";
import { Rating } from "@/components/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getGoogleMapsSearchUrl } from "@/lib/navigation";
import { formatAddress } from "@/lib/utils";
import { Share2 } from "lucide-react";
import Link from "next/link";

export interface RestaurantCardProps {
  restaurant: RestaurantsGETResponse[number];
  view: "grid" | "list";
}

export const RestaurantCard = ({ restaurant, view }: RestaurantCardProps) => {
  const isList = view === "list";

  return (
    <Card className="flex h-full flex-col overflow-hidden py-0">
      <div className={`flex flex-1 ${isList ? "flex-row" : "flex-col"}`}>
        <div
          className={`bg-cover bg-center ${
            isList ? "min-h-full w-32 flex-shrink-0 sm:w-48" : "h-48 w-full"
          }`}
          style={{
            backgroundImage: `url(/placeholder.svg)`,
            backgroundColor: "#f3f4f6",
          }}
        />
        <div className={`flex flex-1 flex-col ${isList ? "" : ""}`}>
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold">
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  className="hover:underline"
                >
                  {restaurant.nameZh || restaurant.nameEn || "-"}
                </Link>
              </h3>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <span className="font-medium">
                  {restaurant.summary?.averageRating ?? "-"}
                </span>
                <Rating
                  value={
                    restaurant.summary?.averageRating
                      ? Number(restaurant.summary.averageRating)
                      : 0
                  }
                  size={12}
                />
                <span>({restaurant.reviewCount ?? 0})</span>
              </div>
              <Link
                href={getGoogleMapsSearchUrl({
                  placeId: restaurant.googleMapsPlaceId,
                  name: restaurant.nameEn ?? restaurant.nameZh,
                  address: formatAddress(restaurant.address),
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-xs underline decoration-dotted underline-offset-2 transition-colors"
              >
                {formatAddress(restaurant.address)}
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {restaurant.tags?.map((tag, i) => (
                <Badge
                  key={tag?.tag?.id ?? i}
                  variant="secondary"
                  className="text-xs"
                >
                  {tag?.tag?.name}
                  <span className="text-muted-foreground text-xs font-medium">
                    {tag?.reviewCount ?? 0}
                  </span>
                </Badge>
              ))}
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
                <Link href={`/restaurants/${restaurant.id}`}>查看详情</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 cursor-pointer bg-transparent"
              >
                <Share2 className="mr-1 size-4" />
                分享
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
