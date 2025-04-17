import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { haversineDistance } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { API } from "@/types/api";
import { AdvancedMarker, CollisionBehavior } from "@vis.gl/react-google-maps";
import { type LucideIcon, LucideUtensils } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { type CSSProperties, type ReactNode } from "react";

export interface PlaceMarkerProps {
  place: API.Place;
  currentLocation?: google.maps.LatLng;
  popoverExtraContent?: ReactNode;
}

const PLACE_MARKER_TYPES: Record<API.PlaceType, { icon: LucideIcon; color: string }> = {
  food: {
    icon: LucideUtensils,
    color: "#fb923c", // orange-400
  },
};

export const PlaceMarker = ({ place, currentLocation, popoverExtraContent }: PlaceMarkerProps) => {
  const type = place.type;
  if (!type) {
    throw new Error(`Place type is required: ${JSON.stringify(place)}`);
  }
  const theme = PLACE_MARKER_TYPES[type];
  const Icon = theme.icon;

  return (
    <AdvancedMarker
      key={place.id}
      position={{
        lat: place.latitude,
        lng: place.longitude,
      }}
      collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
    >
      <Popover>
        <PopoverTrigger>
          <div
            style={
              // Tailwind does not support dynamic classnames
              {
                "--marker-color": theme.color,
              } as CSSProperties
            }
            className={cn(
              "flex",
              "rounded-full",
              "border-2",
              "border-white",
              "size-6",
              "justify-center",
              "items-center",
              "transition",
              "shadow-sm",
              "hover:shadow-md",
              "bg-[var(--marker-color)]",
              "shadow-[var(--marker-color)]",
              "hover:shadow-[var(--marker-color)]",
            )}
          >
            <Icon size={12} color="white" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-2 sm:w-auto">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">{place.name}</p>
              <p className="text-xs font-semibold text-muted-foreground">{place.name_zh}</p>
            </div>
            {popoverExtraContent}
            <div className="flex flex-col space-y-0.5">
              <Link
                href={place.google_maps_url}
                target="_blank"
                title="Open in Google Maps"
                className="text-xs text-blue-500 hover:underline hover:underline-offset-2 dark:text-blue-300"
              >
                {place.address}
              </Link>
              {currentLocation && (
                <p className="text-xs text-muted-foreground">
                  {haversineDistance(
                    currentLocation.lat(),
                    currentLocation.lng(),
                    place.latitude,
                    place.longitude,
                    "mi",
                  ).toFixed(2)}
                  &nbsp;mi away (approx.)
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </AdvancedMarker>
  );
};
