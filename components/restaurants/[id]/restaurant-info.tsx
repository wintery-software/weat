"use client";

import { type GetRestaurantResponse } from "@/app/restaurants/[id]/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  getAppleMapsSearchUrl,
  getGoogleMapsSearchUrl,
} from "@/lib/navigation";
import { formatAddress } from "@/lib/utils";
import { SiApple, SiGooglemaps } from "@icons-pack/react-simple-icons";
import { Clock, MapPin, Phone, StoreIcon } from "lucide-react";
import Link from "next/link";

interface RestaurantInfoProps {
  restaurant: GetRestaurantResponse;
}

export const RestaurantInfo = ({ restaurant }: RestaurantInfoProps) => {
  return (
    <Card id="info" className="lg:col-span-2 xl:col-span-2">
      <CardHeader className="flex items-center gap-2 select-none">
        <StoreIcon className="size-5" />
        <h2>餐厅信息</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="text-primary size-4" />
            {formatAddress(restaurant.place)}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-primary size-4" />
            {restaurant.phone_number ? (
              <Link
                href={`tel:${restaurant.phone_number}`}
                className="underline decoration-dotted underline-offset-2"
              >
                {restaurant.phone_number.replace(
                  /^(\d{3})(\d{3})(\d{4})$/,
                  "($1) $2-$3",
                )}
              </Link>
            ) : (
              <span>-</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-primary size-4" />
            <span>11:00 AM - 9:00 PM</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          asChild
          disabled={!restaurant.place.google_maps_place_id}
        >
          <a
            href={getGoogleMapsSearchUrl({
              placeId: restaurant.place.google_maps_place_id,
              name: restaurant.name_en ?? restaurant.name_zh,
              address: formatAddress(restaurant.place),
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGooglemaps className="size-4" />
            <span>Google&nbsp;Maps</span>
          </a>
        </Button>
        <Button
          className="flex-1"
          asChild
          disabled={!restaurant.place.latitude || !restaurant.place.longitude}
        >
          <a
            href={getAppleMapsSearchUrl({
              name: restaurant.name_en ?? restaurant.name_zh,
              address: formatAddress(restaurant.place),
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiApple className="size-4" />
            <span>Apple&nbsp;Maps</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
