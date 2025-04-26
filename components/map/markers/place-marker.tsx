import { Inter } from "@/lib/font";
import { cn } from "@/lib/utils";
import { API } from "@/types/api";
import { AdvancedMarker, CollisionBehavior, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { type LucideIcon, LucideUtensils } from "lucide-react";
import * as React from "react";
import { type CSSProperties, useEffect } from "react";

export interface PlaceMarkerProps {
  place: API.BasePlace;
  onClick?: (id: string) => void;
}

const PLACE_MARKER_TYPES: Record<API.PlaceType, { icon: LucideIcon; color: string; textColor: string }> = {
  food: {
    icon: LucideUtensils,
    color: "#f97316", // amber-500
    textColor: "#ea580c", // amber-600
  },
};

const TEXT_STROKE_WIDTH = "0.8px";
const TEXT_STROKE_COLOR = "white";

export const PlaceMarker = ({ place, onClick }: PlaceMarkerProps) => {
  const type = place.type;

  if (!type) {
    throw new Error(`Missing place type: ${JSON.stringify(place)}`);
  }
  const theme = PLACE_MARKER_TYPES[type];
  const color = theme.color;
  const textColor = theme.textColor;
  const Icon = theme.icon;

  // To make AdvancedMarkerElement clickable and provide better accessible experiences,
  // use addListener() to register a "click" event on the AdvancedMarkerElement instance.
  const [markerRef, marker] = useAdvancedMarkerRef();

  useEffect(() => {
    if (marker) {
      // Add a click listener to the marker
      marker.addListener("click", () => onClick?.(place.id));
    }

    return () => {
      // Clean up the listener when the component unmounts
      if (marker) {
        google.maps.event.clearInstanceListeners(marker);
      }
    };
  }, [marker, onClick, place]);

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: place.location.latitude, lng: place.location.longitude }}
      collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
      draggable={false}
      className="group hover:cursor-pointer"
    >
      <div className="flex items-center gap-1.5">
        <div
          className="flex size-5 items-center justify-center rounded-full bg-[var(--marker-color)] shadow-md shadow-neutral-500 ring-2 ring-white"
          style={{ "--marker-color": color } as CSSProperties}
        >
          <Icon size={12} color="white" />
        </div>
        <div
          className={cn(
            Inter.className,
            "flex w-48 text-wrap text-sm font-medium leading-none text-[var(--marker-text-color)] group-hover:text-link",
          )}
          style={
            {
              "--marker-text-color": textColor,
              textShadow: `
                -${TEXT_STROKE_WIDTH} -${TEXT_STROKE_WIDTH} 0 ${TEXT_STROKE_COLOR}, 
                ${TEXT_STROKE_WIDTH} -${TEXT_STROKE_WIDTH} 0 ${TEXT_STROKE_COLOR}, 
                -${TEXT_STROKE_WIDTH} ${TEXT_STROKE_WIDTH} 0 ${TEXT_STROKE_COLOR}, 
                ${TEXT_STROKE_WIDTH} ${TEXT_STROKE_WIDTH} 0 ${TEXT_STROKE_COLOR}
              `,
            } as CSSProperties
          }
        >
          {place.name}
          {place.name_zh && ` (${place.name_zh})`}
        </div>
      </div>
    </AdvancedMarker>
  );
};
