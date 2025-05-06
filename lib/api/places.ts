import { WeatAPI } from "../api";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { API } from "@/types/api";
import type { AxiosRequestConfig } from "axios";

export const getPlaces = async (
  {
    swLat = -90,
    swLng = -180,
    neLat = 90,
    neLng = 180,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  }: {
    swLat?: number;
    swLng?: number;
    neLat?: number;
    neLng?: number;
    page?: number;
    pageSize?: number;
  },
  config?: AxiosRequestConfig,
) => {
  const res = await WeatAPI.get<API.Paginated<API.BasePlace>>("/places/", {
    ...config,
    params: {
      sw_lat: swLat,
      sw_lng: swLng,
      ne_lat: neLat,
      ne_lng: neLng,
      page,
      page_size: pageSize,
    },
  });

  return res.data;
};

export const searchPlaces = async (
  {
    q,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  }: {
    q?: string;
    page?: number;
    pageSize?: number;
  },
  config?: AxiosRequestConfig,
) => {
  const res = await WeatAPI.get<API.Paginated<API.Place>>("/places/", {
    ...config,
    params: {
      q,
      page,
      page_size: pageSize,
    },
  });

  return res.data;
};

export const getPlace = async (id: string, config?: AxiosRequestConfig) => {
  const res = await WeatAPI.get<API.Place>(`/places/${id}`, config);

  return res.data;
};
