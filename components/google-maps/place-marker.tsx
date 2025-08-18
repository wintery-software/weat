import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface PlaceMarkerProps {
  latitude: number;
  longitude: number;
  title: string;
}

export const PlaceMarker = ({
  latitude,
  longitude,
  title,
}: PlaceMarkerProps) => (
  <AdvancedMarker position={{ lat: latitude, lng: longitude }} title={title}>
    <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-red-500 shadow-lg">
      <div className="size-2 rounded-full bg-white"></div>
    </div>
  </AdvancedMarker>
);