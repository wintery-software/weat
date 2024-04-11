import { fetchWeatApi } from '@/lib/utils';

export const getRestaurant = (
  id: string,
  locale: string,
  params?: URLSearchParams,
) => fetchWeatApi<Restaurant>(`/restaurants/${id}`, locale, params);

export const getRestaurants = (locale: string, params?: URLSearchParams) =>
  fetchWeatApi<Paginatable<Restaurant>>('/restaurants', locale, params);

export const getRestaurantCategories = (
  locale: string,
  params?: URLSearchParams,
) =>
  fetchWeatApi<RestaurantCategory[]>('/restaurants/categories', locale, params);

export const getRestaurantItem = (
  restaurant_id: string,
  id: string,
  locale: string,
  params?: URLSearchParams,
) =>
  fetchWeatApi<RestaurantItem>(
    `/restaurants/${restaurant_id}/items/${id}`,
    locale,
    params,
  );

export const getRestaurantItems = (
  restaurant_id: string,
  locale: string,
  params?: URLSearchParams,
) =>
  fetchWeatApi<RestaurantItem[]>(
    `/restaurants/${restaurant_id}/items`,
    locale,
    params,
  );

export const search = (q: string, locale: string) =>
  fetchWeatApi(`/search`, locale, new URLSearchParams({ q }));
