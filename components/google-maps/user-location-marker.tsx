import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface UserLocationMarkerProps {
  latitude: number;
  longitude: number;
}

export const UserLocationMarker = ({
  latitude,
  longitude,
}: UserLocationMarkerProps) => (
  <AdvancedMarker
    position={{ lat: latitude, lng: longitude }}
    title="Your Location"
  >
    <div className="relative flex h-4 w-4 items-center justify-center">
      <div className="absolute h-4 w-4 animate-ping rounded-full bg-blue-400 opacity-75"></div>
      <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
    </div>
  </AdvancedMarker>
);
