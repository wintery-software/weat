import { API } from "@/types/api";
import { AdvancedMarker, CollisionBehavior } from "@vis.gl/react-google-maps";
import { type LucideIcon, LucideUtensils } from "lucide-react";
import * as React from "react";
import { type CSSProperties } from "react";

export interface PlaceMarkerProps {
  place: API.Place;
}

const PLACE_MARKER_TYPES: Record<API.PlaceType, { icon: LucideIcon; color: string; textColor: string }> = {
  food: {
    icon: LucideUtensils,
    color: "#f97316", // amber-500
    textColor: "#ea580c", // amber-600
  },
};

const textStrokeWidth = "1px";
const textStrokeColor = "white";

export const PlaceMarker = ({ place }: PlaceMarkerProps) => {
  const type = place.type;
  if (!type) {
    throw new Error(`Place type is required: ${JSON.stringify(place)}`);
  }
  const theme = PLACE_MARKER_TYPES[type];
  const color = theme.color;
  const textColor = theme.textColor;
  const Icon = theme.icon;

  return (
    <AdvancedMarker
      key={place.id}
      title={place.name}
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
          className="flex w-32 text-wrap text-sm font-medium leading-none text-[var(--marker-text-color)] group-hover:text-link"
          style={
            {
              "--marker-text-color": textColor,
              textShadow: `
                -${textStrokeWidth} -${textStrokeWidth} 0 ${textStrokeColor}, 
                ${textStrokeWidth} -${textStrokeWidth} 0 ${textStrokeColor}, 
                -${textStrokeWidth} ${textStrokeWidth} 0 ${textStrokeColor}, 
                ${textStrokeWidth} ${textStrokeWidth} 0 ${textStrokeColor}
              `,
            } as CSSProperties
          }
        >
          {place.name}
        </div>
      </div>
    </AdvancedMarker>
  );
};
