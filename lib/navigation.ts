export const getGoogleMapsSearchUrl = ({
  placeId,
  address,
  name,
}: {
  placeId: string;
  address: string;
  name: string | null | undefined;
}) => {
  const url = new URL("https://www.google.com/maps/search/");

  url.searchParams.set("api", "1");
  url.searchParams.set("query", encodeURIComponent(`${name ?? ""}+${address}`));

  if (placeId) {
    url.searchParams.set("query_place_id", placeId);
  }

  return url.toString();
};

export const getAppleMapsSearchUrl = ({
  address,
  name,
}: {
  address: string;
  name: string | null | undefined;
}) => {
  const query = encodeURIComponent(`${name ?? ""}+${address}`);

  return `https://maps.apple.com/?q=${query}`;
};

/**
 * Convert degrees to radians.
 * @param deg - The angle in degrees.
 * @returns The angle in radians.
 */
const toRad = (deg: number) => deg * (Math.PI / 180);

/**
 * Calculate the distance between two points on the Earth's surface.
 * @param lat1 - The latitude of the first point.
 * @param lon1 - The longitude of the first point.
 * @param lat2 - The latitude of the second point.
 * @param lon2 - The longitude of the second point.
 * @returns The distance in kilometers.
 */
export const getHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Convert kilometers to miles.
 * @param kilometers - The distance in kilometers.
 * @returns The distance in miles.
 */
export const kilometersToMiles = (kilometers: number) => kilometers * 0.621371;

/**
 * Convert miles to kilometers.
 * @param miles - The distance in miles.
 * @returns The distance in kilometers.
 */
export const milesToKilometers = (miles: number) => miles * 1.60934;
