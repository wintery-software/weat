import { WeatAPI } from "@/lib/api";
import type { API } from "@/types/api";
import type { AxiosRequestConfig } from "axios";

export const getPlacesAdmin = async (
  {
    page = 1,
    pageSize = 10,
  }: {
    page?: number;
    pageSize?: number;
  },
  token: string,
  config?: AxiosRequestConfig,
) => {
  if (!token) {
    throw new Error("Missing token");
  }

  const res = await WeatAPI.get<API.Paginated<API.Place>>("/admin/places/", {
    ...config,
    params: {
      page,
      page_size: pageSize,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createPlaceAdmin = async (data: API.CreatePlace, token: string, config?: AxiosRequestConfig) => {
  if (!token) {
    throw new Error("Missing token");
  }

  const res = await WeatAPI.post<API.Place>("/admin/places", data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updatePlaceAdmin = async (
  id: string,
  data: API.UpdatePlace,
  token: string,
  config?: AxiosRequestConfig,
) => {
  if (!token) {
    throw new Error("Missing token");
  }

  const res = await WeatAPI.put<API.Place>(`/admin/places/${id}`, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deletePlaceAdmin = async (id: string, token: string, config?: AxiosRequestConfig) => {
  if (!token) {
    throw new Error("Missing token");
  }

  const res = await WeatAPI.delete<API.Place>(`/admin/places/${id}`, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
