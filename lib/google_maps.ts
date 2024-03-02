import { meterToMile } from '@/lib/constants';
import {
  Client,
  PlacePhoto,
  UnitSystem,
} from '@googlemaps/google-maps-services-js';
import { ResponseData } from '@googlemaps/google-maps-services-js/src/common';

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

export const getPlaceDetails = async (placeId: string) => {
  const apiKey = getApiKey();
  const client = getClient();

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: [
          'name',
          'formatted_address',
          'geometry',
          'place_id',
          'types',
          'price_level',
          'rating',
          'photos',
        ],
        key: apiKey,
      },
    });

    const place = response.data.result;

    // Short URL with zoom level 19 (200 ft)
    const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;

    const images = place.photos
      ? place.photos
          .slice(0, 5)
          .map(
            (photo: PlacePhoto) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`,
          )
      : [];

    // Format the data
    return {
      name: place.name,
      address: place.formatted_address,
      googleMapsUrl,
      googleMapsPlaceId: placeId,
      // categories: place.types.map((type) => type.replace('_', ' ')),
      price: place.price_level,
      rating: place.rating,
      images,
    };
  } catch (e: any) {
    const error: ResponseData = e.response.data;
    console.log(error.error_message);
    throw new GoogleMapsApiError(error.error_message);
  }
};
