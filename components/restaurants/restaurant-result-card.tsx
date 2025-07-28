import { type RestaurantsData } from "@/app/api/restaurants/route";
import { Rating } from "@/components/rating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getGoogleMapsSearchUrl } from "@/lib/navigation";
import {
  formatAddress,
  formatDistance,
  getRestaurantImageUrl,
} from "@/lib/utils";
import { type TopTag, type ViewMode } from "@/types/types";
import { MapPin } from "lucide-react";
import Link from "next/link";

export interface RestaurantResultCardProps {
  restaurant: RestaurantsData & { distance?: number };
  view: ViewMode;
}

export const RestaurantResultCard = ({
  restaurant,
  view,
}: RestaurantResultCardProps) => {
  const isList = view === "list";

  return (
    <Card className="flex h-full flex-col overflow-hidden py-0">
      <div className={`flex flex-1 ${isList ? "flex-row" : "flex-col"}`}>
        <Link
          href={`/restaurants/${restaurant.id}`}
          className={`bg-cover bg-center ${
            isList ? "min-h-full w-32 flex-shrink-0 sm:w-48" : "h-48 w-full"
          }`}
          style={{
            backgroundImage: `url(${
              restaurant.images.length > 0
                ? getRestaurantImageUrl(
                    restaurant.id,
                    restaurant.display_image ?? restaurant.images[0],
                  )
                : "/placeholder.svg"
            })`,
            backgroundColor: "#f3f4f6",
          }}
        />
        <div className={`flex flex-1 flex-col ${isList ? "" : ""}`}>
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col gap-1">
              <div>
                <h3 className="font-bold">
                  <Link
                    href={`/restaurants/${restaurant.id}`}
                    className="hover:underline"
                  >
                    {restaurant.name_zh || restaurant.name_en || "-"}
                  </Link>
                </h3>
                {restaurant.name_zh && (
                  <p className="text-muted-foreground text-xs font-medium">
                    {restaurant.name_en}
                  </p>
                )}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {restaurant.summary?.average_rating ?? "-"}
                  </span>
                  <Rating
                    value={restaurant.summary?.average_rating ?? 0}
                    size={12}
                  />
                  <span>({restaurant.summary?.review_count ?? 0})</span>
                </div>
                {restaurant.distance && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3" />
                    <span>
                      {formatDistance(restaurant.distance, "imperial")} mi
                    </span>
                  </span>
                )}
              </div>
              <Link
                href={getGoogleMapsSearchUrl({
                  placeId: restaurant.place.google_maps_place_id,
                  name: restaurant.name_en ?? restaurant.name_zh,
                  address: formatAddress(restaurant.place),
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-xs underline-offset-2 transition-colors hover:underline"
              >
                {formatAddress(restaurant.place)}
              </Link>
            </div>

            <div className="relative mt-3 overflow-hidden">
              <div className="flex gap-1 overflow-x-auto pr-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {(restaurant.summary?.top_tags as TopTag[])?.map(
                  ([name, mention_count], i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="flex-shrink-0 text-xs"
                    >
                      {name}
                      <span className="text-muted-foreground text-xs font-medium">
                        {mention_count}
                      </span>
                    </Badge>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
