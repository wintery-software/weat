'use client';

import {
  StandardLayout,
  StandardLayoutBradcrumb,
  StandardLayoutContent,
  StandardLayoutDescription,
  StandardLayoutHeader,
  StandardLayoutNoResult,
  StandardLayoutTitle,
} from '@/app/layouts/standard_layout';
import Content from '@/app/restaurants/_content';
import Filter from '@/app/restaurants/_filter';
import Sort, { RestaurantSortKey, sortFields } from '@/app/restaurants/_sort';
import { SortOrder } from '@/components/sort_select';
import { Button } from '@/components/ui/button';
import { DistanceReturnType, isGoogleMapsApiEnabled } from '@/lib/google-maps';
import { Restaurant } from '@prisma/client';
import { IconFilter } from '@tabler/icons-react';
import { isEmpty } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const generateSearchParams = (
  categories: string[],
  prices: string[],
  rating: number,
  distance: number,
  sortBy: [RestaurantSortKey, SortOrder],
): URLSearchParams => {
  const params = new URLSearchParams();

  // Filter
  categories.forEach((category) => params.append('category', category));
  prices.forEach((price) => params.append('price', price));
  rating && params.append('rating', rating.toString());
  distance && params.append('distance', distance.toString());

  // Sort
  const defaultSort = Object.entries(sortFields)[0];
  sortBy[0] !== defaultSort[0] && params.append('sort', sortBy[0]);
  sortBy[1] !== defaultSort[1].order[0] && params.append('order', sortBy[1]);

  return params;
};

const useRestaurants = (params: URLSearchParams) => {
  return useSWR(`/restaurants?${params}`, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });
};

export interface RestaurantType extends Restaurant {
  categories: string[];
  distance: DistanceReturnType | null;
}

export default function Restaurants() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, error, isLoading } = useRestaurants(searchParams);

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Prevent fetching too much when dragging the slider
  const [updatingDistance, setUpdatingDistance] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | string | null
  >(null);
  const [sortBy, setSortBy] = useState<[RestaurantSortKey, SortOrder]>([
    'relevance',
    'desc',
  ]);

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
    router.push(`/restaurants?${params}`, { scroll: false });
    // Only pass coordinates to server
    if (Array.isArray(currentLocation)) {
      params.append('origin', currentLocation.join(','));
    }
  }, [
    categories,
    currentLocation,
    distance,
    prices,
    rating,
    router,
    sortBy,
    updatingDistance,
  ]);

  // Only fetch current location once, on mount
  useEffect(() => {
    if (!isGoogleMapsApiEnabled()) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
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
    <StandardLayout>
      <StandardLayoutHeader>
        <StandardLayoutBradcrumb current="餐厅" />
        <StandardLayoutTitle>RTP 餐厅</StandardLayoutTitle>
        <StandardLayoutDescription>test</StandardLayoutDescription>
      </StandardLayoutHeader>
      <div className="md:container md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="col-span-1 md:mt-4">
          <Filter
            className="md:bg-white md:p-4 md:rounded-md md:shadow-md"
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
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-4">
          <div className="flex gap-1 md:justify-end mx-8 mt-4">
            <Button
              className="flex md:hidden"
              variant="outline"
              size="icon"
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              <IconFilter size={14} />
            </Button>
            <Sort current={sortBy} setCurrent={setSortBy} />
          </div>
          <StandardLayoutContent
            isLoading={isLoading}
            skeletonClassName="h-[102px]"
          >
            {isEmpty(data) ? (
              <StandardLayoutNoResult />
            ) : (
              <Content restaurants={data} />
            )}
          </StandardLayoutContent>
        </div>
      </div>
    </StandardLayout>
  );
}
