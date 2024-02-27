'use client';

import DataLayout from '@/app/layouts/data_layout';
import Content from '@/app/restaurants/content';
import Filter from '@/app/restaurants/filter';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const generateSearchParams = (
  categories: string[],
  prices: string[],
  rating: number,
  distance: number,
): URLSearchParams => {
  const params = new URLSearchParams();

  categories.forEach((category) => params.append('category', category));
  prices.forEach((price) => params.append('price', price));
  rating && params.append('rating', rating.toString());
  distance && params.append('distance', distance.toString());

  return params;
};

const getRestaurants = async (params: URLSearchParams) => {
  const response = await fetch('/api/restaurants?' + params);
  return response.json();
};

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
  const [updatingDistance, setUpdatingDistance] = useState(false);
  const [origin, setOrigin] = useState<[number, number]>([0, 0]);

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (updatingDistance) return;

    const params = generateSearchParams(categories, prices, rating, distance);
    // Update URL
    router.push(`/restaurants?${params}`);
    // Pass coordinates to server
    params.append('origin', origin.join(','));
    getRestaurants(params).then((data) => {
      setRestaurants(data);
      setLoading(false);
    });
  }, [categories, distance, updatingDistance, origin, prices, rating, router]);

  useEffect(() => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        setOrigin([latitude, longitude]);
        setLoading(false);
      },
      (error) => {
        throw error;
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
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
          />
        }
        content={<Content restaurants={restaurants} loading={loading} />}
      />
    </>
  );
}
