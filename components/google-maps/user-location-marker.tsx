"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface UserLocationMarkerProps {
  userLocation: GeolocationCoordinates;
  pulseSpeed?: "slow" | "normal" | "fast" | number; // number in seconds
}

export const UserLocationMarker = ({
  userLocation,
  pulseSpeed = "normal",
}: UserLocationMarkerProps) => {
  // Convert pulse speed to animation duration
  const getAnimationDuration = () => {
    if (typeof pulseSpeed === "number") {
      return `${pulseSpeed}s`;
    }

    switch (pulseSpeed) {
      case "slow":
        return "3s";
      case "fast":
        return "0.75s";
      case "normal":
      default:
        return "1.5s";
    }
  };

  const animationStyle = {
    animation: `pulse ${getAnimationDuration()} cubic-bezier(0, 0, 0.2, 1) infinite`,
  };

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
      <AdvancedMarker
        position={{
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        }}
        title="Your Location"
      >
        <div className="relative flex size-6 items-center justify-center">
          {/* Pulsing outer ring with custom animation */}
          <div
            className="absolute size-4 rounded-full bg-blue-400"
            style={animationStyle}
          />
          {/* Static outer ring */}
          <div className="absolute size-6 rounded-full bg-blue-400 opacity-20" />
          {/* Inner dot */}
          <div className="size-4 rounded-full border-2 border-white bg-blue-600 shadow-md" />
        </div>
      </AdvancedMarker>
    </>
  );
};
