'use client';

import DataLayout from '@/app/layouts/data_layout';
import Content from '@/app/restaurants/content';
import FilterSidebar from '@/app/restaurants/filter_sidebar';
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

  const [categories, setCategories] = useState<string[]>(searchParams.getAll('category').filter(Boolean));
  const [prices, setPrices] = useState<string[]>(searchParams.getAll('price').filter(Boolean));
  const [rating, setRating] = useState<number>(Number(searchParams.get('rating')) || 0);
  const [distance, setDistance] = useState<number>(Number(searchParams.getAll('distance')) || 0);

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const params = generateSearchParams(categories, prices, rating, distance);
    router.push(`/restaurants?${params}`);
    getRestaurants(params).then(setRestaurants);
  }, [categories, distance, prices, rating, router]);

  return (
    <>
      <DataLayout
        filter={
          <FilterSidebar
            selectedCategories={categories}
            setSelectedCategories={setCategories}
            selectedPrices={prices}
            setSelectedPrices={setPrices}
            selectedRating={rating}
            setSelectedRating={setRating}
            selectedDistance={distance}
            setSelectedDistance={setDistance}
          />
        }
        content={<Content restaurants={restaurants} />}
      />
    </>
  );
}
