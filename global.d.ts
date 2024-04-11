// Use type safe message keys with `next-intl`
type Messages = typeof import('@/lib/i18n/translations/en.json');

declare interface IntlMessages extends Messages {}

type SearchParams = Record<string, string>;

interface Paginatable<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
}

interface Restaurant {
  address: string | null;
  categories: RestaurantCategory[];
  google_place_id: string;
  id: string;
  images: string[];
  name: string;
  price: number | null;
  rating: number | null;
  url: string | null;
}

interface RestaurantCategory {
  id: string;
  name: string;
}

interface RestaurantItem {
  category: RestaurantItemCategory;
  description: string | null;
  id: string;
  image: string | null;
  name: string;
  price: number;
}

interface RestaurantItemCategory {
  id: string;
  name: string;
}
