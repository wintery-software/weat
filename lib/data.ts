import { fetchWeatApi, getWeatApiUrl } from '@/lib/utils';

/**
 * Check if the API is healthy.
 *
 * @param timeout The request timeout in milliseconds.
 * @returns A promise that resolves to `true` if the API is healthy, otherwise `false`.
 */
export const checkApiHealth = async (timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(getWeatApiUrl('/health'), {
      cache: 'no-store',
      signal: controller.signal,
    });
    return response.ok;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
};

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
