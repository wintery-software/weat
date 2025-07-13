"use client";

import { RestaurantData } from "@/app/api/restaurants/[id]/route";
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
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { Clock, MapPin, Phone, StoreIcon } from "lucide-react";
import Link from "next/link";

interface RestaurantInfoProps {
  restaurant: RestaurantData;
}

export const RestaurantInfo = ({ restaurant }: RestaurantInfoProps) => {
  return (
    <Card className="lg:col-span-2 xl:col-span-2">
      <CardHeader className="flex items-center gap-2 select-none">
        <StoreIcon className="size-5" />
        <h2>餐厅信息</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden rounded-md border">
          {restaurant.latitude && restaurant.longitude ? (
            <Map
              defaultZoom={15}
              defaultCenter={{
                lat: restaurant.latitude,
                lng: restaurant.longitude,
              }}
              mapId="#"
              className="h-full w-full"
              gestureHandling="greedy"
              disableDefaultUI
              zoomControl={true}
              scrollwheel={true}
            >
              <AdvancedMarker
                position={{
                  lat: restaurant.latitude,
                  lng: restaurant.longitude,
                }}
                title={restaurant.name_zh || restaurant.name_en}
              />
            </Map>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground text-sm">暂无位置信息</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="text-primary size-4" />
            {formatAddress(restaurant.address)}
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
          disabled={!restaurant.google_maps_place_id}
        >
          <a
            href={getGoogleMapsSearchUrl({
              placeId: restaurant.google_maps_place_id,
              name: restaurant.name_en ?? restaurant.name_zh,
              address: formatAddress(restaurant.address),
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
          disabled={!restaurant.latitude || !restaurant.longitude}
        >
          <a
            href={getAppleMapsSearchUrl({
              name: restaurant.name_en ?? restaurant.name_zh,
              address: formatAddress(restaurant.address),
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
