'use client';

import DataLayout from '@/app/layouts/data_layout';
import Content from '@/app/restaurants/content';
import Filter from '@/app/restaurants/filter';
import { RestaurantSortFieldsType, SortOrdersType } from '@/lib/constants';
import { isGoogleMapsApiEnabled } from '@/lib/google_maps';
import { fetchWeatApi } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const generateSearchParams = (
  categories: string[],
  prices: string[],
  rating: number,
  distance: number,
  sortBy: [string, string],
): URLSearchParams => {
  const params = new URLSearchParams();

  categories.forEach((category) => params.append('category', category));
  prices.forEach((price) => params.append('price', price));
  rating && params.append('rating', rating.toString());
  distance && params.append('distance', distance.toString());
  sortBy[0] !== 'rating' && params.append('sort', sortBy[0]);
  sortBy[1] !== 'desc' && params.append('order', sortBy[1]);

  return params;
};

const getRestaurants = async (params: URLSearchParams) =>
  await fetchWeatApi('restaurants', params);

export default function Restaurants() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<string[]>(
    searchParams.getAll('category').filter(Boolean),
  );
  const [prices, setPrices] = useState<string[]>(
    searchParams.getAll('price').filter(Boolean),
  );
  const [rating, setRating] = useState<number>(
    Number(searchParams.get('rating')) || 0,
  );
  const [distance, setDistance] = useState<number>(
    Number(searchParams.getAll('distance')) || 0,
  );

  // Prevent fetching too much when dragging the slider
  const [updatingDistance, setUpdatingDistance] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | string | null
  >(null);
  const [sortBy, setSortBy] = useState<
    [keyof RestaurantSortFieldsType, keyof SortOrdersType]
  >(['rating', 'desc']);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Prevent fetching too much when dragging the slider
    if (updatingDistance) return;

    const params = generateSearchParams(
      categories,
      prices,
      rating,
      distance,
      sortBy,
    );
    // Update URL without coordinates
    router.push(`/restaurants?${params}`);
    // Only pass coordinates to server
    if (Array.isArray(currentLocation)) {
      params.append('origin', currentLocation.join(','));
    }
    setLoading(true);

    getRestaurants(params).then((data) => {
      setRestaurants(data);
      setLoading(false);
    });
  }, [
    categories,
    distance,
    updatingDistance,
    currentLocation,
    prices,
    rating,
    router,
    sortBy,
  ]);

  // Only fetch current location once, on mount
  useEffect(() => {
    if (!isGoogleMapsApiEnabled()) {
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        setLoading(false);
      },
      (error) => {
        setCurrentLocation(`无法定位: ${error.message}`);
        throw error;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  return (
    <>
      <DataLayout
        filter={
          <Filter
            selectedCategories={categories}
            setSelectedCategories={setCategories}
            selectedPrices={prices}
            setSelectedPrices={setPrices}
            selectedRating={rating}
            setSelectedRating={setRating}
            selectedDistance={distance}
            setSelectedDistance={setDistance}
            setUpdatingDistance={setUpdatingDistance}
            currentLocation={currentLocation}
          />
        }
        content={
          <Content
            restaurants={restaurants}
            loading={loading}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        }
      />
    </>
  );
}
