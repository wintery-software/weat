import { EARTH_METERS_PER_DEGREE } from "@/lib/constants";

/**
 * Get the current geolocation permission status.
 * @returns "granted", "denied", or "prompt"
 */
export const getGeolocationPermissionStatus = () =>
  navigator.permissions
    .query({ name: "geolocation" })
    .then((status) => status.state);

/**
 * Get the current geolocation of the user.
 *
 * @param options Options for the geolocation request
 * @returns Promise that resolves to the current geolocation of the user
 */
export const getCurrentPosition = async (options?: PositionOptions) => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser.");
  }

  // Default options with reasonable timeouts
  const defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000, // 5 seconds timeout
    maximumAge: 60000, // 1 minute cached position
    ...options,
  };

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
};

/**
 * Convert degrees to radians.
 *
 * @param deg Degrees
 * @returns Radians value
 */
export const toRadians = (deg: number) => (deg * Math.PI) / 180;

/**
 * Calculate the distance between two points on the Earth's surface using the Haversine formula.
 *
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @param unit Unit of distance measurement
 * @returns Distance between the two points in the specified unit
 */
export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: "mi" | "km" = "mi",
) => {
  const R = 6371; // Radius of Earth in km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * (unit === "mi" ? 0.621371 : 1);
};

/**
 * Converts distance in meters to degrees of latitude/longitude at the equator.
 * 1 degree ≈ 111,000 meters at the equator
 *
 * @param meters Distance in meters
 * @returns Distance in degrees of latitude/longitude
 */
export const metersToLatLngDegrees = (meters: number) =>
  meters / EARTH_METERS_PER_DEGREE;

/**
 * Check if a coordinate is within the bounds of current map view.
 *
 * @param coords Coordinate to check
 * @param bounds Bounds of the current map view
 * @returns Whether the coordinate is within the bounds
 */
export const isCoordinateInBounds = (
  coords: { lat: number; lng: number },
  bounds: google.maps.LatLngBounds,
) =>
  coords.lat >= bounds.getSouthWest().lat() &&
  coords.lat <= bounds.getNorthEast().lat() &&
  coords.lng >= bounds.getSouthWest().lng() &&
  coords.lng <= bounds.getNorthEast().lng();
