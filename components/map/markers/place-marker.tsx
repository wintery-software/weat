import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { haversineDistance } from "@/lib/maps";
import { PLACE_COLORS, PLACE_ICONS } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { AdvancedMarker, CollisionBehavior } from "@vis.gl/react-google-maps";
import Link from "next/link";
import * as React from "react";
import { CSSProperties, ReactNode } from "react";

export interface PlaceMarkerProps {
  place: Place;
  currentLocation?: google.maps.LatLng;
  popoverExtraContent?: ReactNode;
}

export const PlaceMarker = ({
  place,
  currentLocation,
  popoverExtraContent,
}: PlaceMarkerProps) => {
  const Icon = PLACE_ICONS[place.category];

  return (
    <AdvancedMarker
      key={place.id}
      position={{ lat: place.latitude, lng: place.longitude }}
      collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
    >
      <Popover>
        <PopoverTrigger>
          <div
            style={
              // Tailwind does not support dynamic classnames
              {
                "--marker-color": PLACE_COLORS[place.category],
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
        <PopoverContent className="w-auto p-2">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-semibold">{place.name}</p>
              {place.name_translation && (
                <p className="text-xs">{place.name_translation}</p>
              )}
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
