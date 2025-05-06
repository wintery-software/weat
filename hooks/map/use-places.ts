import { getPlace, getPlaces } from "@/lib/api/places";
// hooks/useSelectedPlace.ts
import { useQuery } from "@tanstack/react-query";

export const usePlaceQuery = (id: string | null) =>
  useQuery({
    queryKey: ["place", id],
    queryFn: () => getPlace(id!),
    enabled: !!id,
  });

export const useBasePlacesQuery = (bounds: google.maps.LatLngBounds | undefined, pageSize: number) =>
  useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const sw = bounds!.getSouthWest().toJSON();
      const ne = bounds!.getNorthEast().toJSON();

      const response = await getPlaces({
        swLat: sw.lat,
        swLng: sw.lng,
        neLat: ne.lat,
        neLng: ne.lng,
        pageSize,
      });

      return response.items;
    },
    enabled: false,
  });
