import { upload } from '@/lib/aws-s3';
import { meterToMile } from '@/lib/constants';
import {
  Client,
  PlaceData,
  PlacePhoto,
  UnitSystem,
} from '@googlemaps/google-maps-services-js';
import { ResponseData } from '@googlemaps/google-maps-services-js/src/common';
import { Prisma } from '@prisma/client';
import RestaurantCreateInput = Prisma.RestaurantCreateInput;

export class GoogleMapsApiError extends Error {
  constructor(message: string, ...args: any[]) {
    super(message, ...args);
    this.name = 'GoogleMapsApiError';
  }
}

export class GoogleMapsApiInitializationError extends GoogleMapsApiError {
  constructor(message: string, ...args: any[]) {
    super(message, ...args);
    this.name = 'GoogleMapsApiInitializationError';
  }
}

export type DistanceReturnType = {
  // Distance in miles
  distance: number;
  // Duration in minutes
  duration: number;
};

export const isGoogleMapsApiEnabled = () =>
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_ENABLED === 'true';

const getApiKey = (): string => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new GoogleMapsApiInitializationError(
      'Google Maps API key is not set',
    );
  }

  return apiKey;
};

const getClient = (): Client => {
  if (!isGoogleMapsApiEnabled()) {
    throw new GoogleMapsApiInitializationError('Google Maps API is disabled');
  }

  return new Client({});
};

export const calculateDistance = async (
  originCoordinates: [number, number],
  destinationPlaceId: string,
): Promise<DistanceReturnType> => {
  const apiKey = getApiKey();
  const client = getClient();

  if (!Array.isArray(originCoordinates) || originCoordinates.length !== 2) {
    throw new Error(`Invalid origin coordinates: ${originCoordinates}`);
  }

  if (!destinationPlaceId) {
    throw new Error('Missing destination place ID');
  }

  const response = await client.distancematrix({
    params: {
      origins: [originCoordinates],
      destinations: [`place_id:${destinationPlaceId}`],
      units: UnitSystem.imperial,
      key: apiKey,
    },
  });

  const result = response.data.rows[0].elements[0];

  return {
    distance: meterToMile(result.distance.value),
    duration: result.duration.value / 60,
  };
};

export const getPlaceDetails = async (
  placeId: string,
): Promise<RestaurantCreateInput> => {
  const apiKey = getApiKey();
  const client = getClient();

  const fields: (keyof PlaceData)[] = [
    'name',
    'formatted_address',
    'price_level',
    'rating',
    'photos',
  ];

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields,
        key: apiKey,
      },
    });

    const place = response.data.result;

    // First 5 images
    const images = place.photos
      ? place.photos
          .slice(0, 5)
          .map((photo: PlacePhoto) => photo.photo_reference)
      : [];

    // Format the data
    return {
      placeId,
      name: place.name!,
      address: place.formatted_address!,
      price: place.price_level || 0,
      rating: place.rating || 0,
      images,
    };
  } catch (e: any) {
    if (e.response?.data) {
      const error: ResponseData = e.response.data;
      console.log(error.error_message);
      throw new GoogleMapsApiError(error.error_message);
    } else {
      console.log(e.message);
      throw e;
    }
  }
};

export const getPlaceUrl = (address: string, placeId: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${address}&query_place_id=${placeId}`;

export const getPlacePhotoUrl = (
  photoReference: string,
  maxWidth: number = 1024,
): string =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${getApiKey()}`;

export const uploadPlacePhotoToS3 = async (
  placeId: string,
  photoReference: string,
) => {
  const photoUrl = getPlacePhotoUrl(photoReference);
  const response = await fetch(photoUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to download photo (${response.status} ${response.statusText}): ${photoUrl}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const key = `google-maps/${placeId}/${photoReference}.jpg`;

  return upload(key, buffer, 'image/jpeg');
};
