import { meterToMile } from '@/lib/constants';
import { Client, UnitSystem } from '@googlemaps/google-maps-services-js';

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
    throw new Error('Google Maps API key is not set');
  }

  return apiKey;
};

const getClient = (): Client => {
  if (!isGoogleMapsApiEnabled()) {
    throw new Error('Google Maps API is disabled');
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
