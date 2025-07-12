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

export const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return d;
};
