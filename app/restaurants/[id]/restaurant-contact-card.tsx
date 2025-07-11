"use client";

import { RestaurantGETResponse } from "@/app/api/restaurants/[id]/route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAppleMapsSearchUrl,
  getGoogleMapsSearchUrl,
} from "@/lib/navigation";
import { formatAddress } from "@/lib/utils";
import { SiApple, SiGooglemaps } from "@icons-pack/react-simple-icons";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";

interface RestaurantContactCardProps {
  restaurant: RestaurantGETResponse;
}

export const RestaurantContactCard = ({
  restaurant,
}: RestaurantContactCardProps) => {
  // Mock data for fields not in our Restaurant interface
  const mockData = {
    hours: "11:00 AM - 10:00 PM",
  };

  return (
    <Card id="contact" className="lg:col-span-2 xl:col-span-2">
      <CardContent className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">联系方式</h3>
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
            <Link
              href={`tel:${restaurant.phone_number}`}
              className="underline decoration-dotted underline-offset-2"
            >
              {restaurant.phone_number}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-primary size-4" />
            <span>{mockData.hours}</span>
          </div>
        </div>
        <div className="flex gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
};
