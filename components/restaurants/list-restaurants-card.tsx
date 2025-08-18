import { type ListRestaurantsResponseData } from "@/app/restaurants/actions";
import { Rating } from "@/components/rating";
import { Card, CardContent } from "@/components/ui/card";
import { getGoogleMapsSearchUrl } from "@/lib/navigation";
import { formatAddress, formatDistance } from "@/lib/utils";
import { type RestaurantResultsViewMode } from "@/types/restaurants";
import { MapPin } from "lucide-react";
import Link from "next/link";

interface RestaurantsResultCardProps {
  restaurant: ListRestaurantsResponseData;
  view: RestaurantResultsViewMode;
}

const RestaurantImage = ({
  restaurant,
  isList,
}: {
  restaurant: ListRestaurantsResponseData;
  isList: boolean;
}) => (
  <Link
    href={`/restaurants/${restaurant.id}`}
    className={`bg-gray-100 bg-cover bg-center ${
      isList ? "min-h-full w-32 flex-shrink-0 sm:w-48" : "h-48 w-full"
    }`}
    style={{
      backgroundImage: `url("/placeholder.svg")`,
    }}
  />
);

const RestaurantInfo = ({
  restaurant,
}: {
  restaurant: ListRestaurantsResponseData;
}) => (
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
        <span className="font-medium">-</span>
        <Rating value={0} size={12} />
        <span>(0)</span>
      </div>
      {restaurant.place.distance && (
        <span className="flex items-center gap-1">
          <MapPin className="size-3" />
          <span>
            {formatDistance(restaurant.place.distance, "imperial")} mi
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
);

export const ListRestaurantsCard = ({
  restaurant,
  view,
}: RestaurantsResultCardProps) => {
  const isList = view === "list";

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className={`flex flex-1 ${isList ? "flex-row" : "flex-col"}`}>
        <RestaurantImage restaurant={restaurant} isList={isList} />
        <div className="flex flex-1 flex-col">
          <CardContent className="flex-1 p-4">
            <RestaurantInfo restaurant={restaurant} />
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
