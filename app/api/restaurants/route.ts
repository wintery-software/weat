import { promises as fs } from 'fs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const categories = new Set(params.getAll('category').filter(Boolean));
  const prices = new Set(params.getAll('price').filter(Boolean).map(Number));
  const rating = Number(params.get('rating')) || 0;
  const distance = Number(params.getAll('distance')) || 0;

  const restaurants = await all();
  const filtered = restaurants
    .filter((r) => {
      const matchCategories = categories.size === 0 || r.category.some((e) => categories.has(e));
      const matchPrices = prices.size === 0 || prices.has(r.price);
      const matchRating = rating === 0 || r.rating >= rating;

      return matchCategories && matchPrices && matchRating;
    })
    .map((r, id) => ({
      ...r,
      id,
    }));

  return Response.json(filtered);
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  googleMapsUrl: string;
  category: string[];
  price: number;
  rating: number;
  images: string[];
}

const all = async (): Promise<Omit<Restaurant, 'id'>[]> => {
  const file = await fs.readFile(`${process.cwd()}/app/api/restaurants/data.json`, 'utf-8');
  return JSON.parse(file);
};
