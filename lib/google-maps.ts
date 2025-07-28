// Constructs a Google Maps Place Photos (New) URL
// https://developers.google.com/maps/documentation/places/web-service/place-photos
// Example:
// https://places.googleapis.com/v1/places/PLACE_ID/photos/PHOTO_RESOURCE/media?maxHeightPx=400&maxWidthPx=400&key=API_KEY

import axios from "axios";

interface GoogleMapsPlaceDetailPhoto {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: [
    {
      displayName: string;
      uri: string;
      photoUri: string;
    },
  ];
  flagContentUri: string;
  googleMapsUri: string;
}

/**
 * Fetches the name of the first photo for a given Google Maps place_id using the Places API (New).
 * @param placeId - The Google Maps place_id
 * @returns The name of the first photo
 * @see https://developers.google.com/maps/documentation/places/web-service/place-details
 * @see https://developers.google.com/maps/billing-and-pricing/pricing#places-pricing
 */
export const getFirstGoogleMapsPlacePhotoName = async (placeId: string) => {
  // Trigger the Place Details Essentials IDs Only SKU - Free
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=photos`;

  const response = await axios.get(url, {
    headers: {
      "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      "X-Goog-FieldMask": "photos",
    },
  });

  const photos: GoogleMapsPlaceDetailPhoto[] = response.data.photos;

  return photos[0]?.name;
};

/**
 * Constructs a Google Maps Place Photo URL
 * @param name - The photo resource name, e.g. "places/PLACE_ID/photos/PHOTO_RESOURCE"
 * @param maxHeightPx - Optional max height in px, default to 1600
 * @param maxWidthPx - Optional max width in px, default to 1600
 * @returns The URL of the photo
 * @see https://developers.google.com/maps/documentation/places/web-service/place-photos
 */
export const getGoogleMapsPlacePhotoUrl = (
  name: string,
  maxHeightPx: number = 1600,
  maxWidthPx: number = 1600,
): string => {
  const url = new URL(`https://places.googleapis.com/v1/${name}/media`);

  url.searchParams.set("key", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!);

  if (maxHeightPx) {
    url.searchParams.set("maxHeightPx", maxHeightPx.toString());
  }

  if (maxWidthPx) {
    url.searchParams.set("maxWidthPx", maxWidthPx.toString());
  }

  return url.toString();
};
