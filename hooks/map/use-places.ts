// hooks/usePlaces.ts
import { WeatAPI } from "@/lib/api";
import type { API } from "@/types/api";
// hooks/useSelectedPlace.ts
import { useQuery } from "@tanstack/react-query";

export const fetchPlace = async (id: string) => {
  const response = await WeatAPI.get<API.Place>(`/places/${id}`);

  return response.data;
};

export const usePlaceQuery = (id: string | null) =>
  useQuery({
    queryKey: ["place", id],
    queryFn: () => fetchPlace(id!),
    enabled: !!id,
  });

const fetchBasePlaces = async (bounds: google.maps.LatLngBounds | undefined, pageSize: number) => {
  const sw = bounds!.getSouthWest().toJSON();
  const ne = bounds!.getNorthEast().toJSON();

  const response = await WeatAPI.get<API.Paginated<API.BasePlace>>("/places/", {
    params: {
      sw_lat: sw.lat,
      sw_lng: sw.lng,
      ne_lat: ne.lat,
      ne_lng: ne.lng,
      page_size: pageSize,
    },
  });

  return response.data.items;
};

export const useBasePlacesQuery = (bounds: google.maps.LatLngBounds | undefined, pageSize: number) =>
  useQuery({
    queryKey: ["places"],
    queryFn: () => fetchBasePlaces(bounds, pageSize),
    enabled: false,
  });
