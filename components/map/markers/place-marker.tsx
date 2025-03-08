import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { haversineDistance } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { AdvancedMarker, CollisionBehavior } from "@vis.gl/react-google-maps";
import {
  LucideCircleHelp,
  LucideCupSoda,
  LucideGamepad2,
  LucidePawPrint,
  LucideTreePine,
  LucideUtensils,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { CSSProperties, ReactNode } from "react";

export interface PlaceMarkerProps {
  place: Weat.Place;
  currentLocation?: google.maps.LatLng;
  popoverExtraContent?: ReactNode;
}

const PLACE_MARKER_THEMES = {
  restaurant: {
    icon: LucideUtensils,
    color: "#fb923c", // orange-400
  },
  drink: {
    icon: LucideCupSoda,
    color: "#a16207", // yellow-700
  },
  park: {
    icon: LucideTreePine,
    color: "#16a34a", // green-600
  },
  dogPark: {
    icon: LucidePawPrint,
    color: "#16a34a", // green-600
  },
  entertainment: {
    icon: LucideGamepad2,
    color: "#a78bfa", // violet-400
  },
  other: {
    icon: LucideCircleHelp,
    color: "#737373", // neutral-500
  },
};

export const PlaceMarker = ({ place, currentLocation, popoverExtraContent }: PlaceMarkerProps) => {
  const type = place.types[0];
  if (!type) {
    throw new Error(`Place type is required: ${JSON.stringify(place)}`);
  }
  const theme = PLACE_MARKER_THEMES[type];
  const Icon = theme.icon;

  return (
    <AdvancedMarker
      key={place.id}
      position={place.location}
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
        <PopoverContent className="w-auto p-2">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-semibold">{place.name.text}</p>
            </div>
            {popoverExtraContent}
            <div className="flex flex-col space-y-0.5">
              <Link
                href={place.googleMapsUrl}
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
                    place.location.lat,
                    place.location.lng,
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
