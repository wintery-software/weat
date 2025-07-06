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
