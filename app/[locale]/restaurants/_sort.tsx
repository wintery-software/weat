import { SortKeyProps, SortOrder, SortSelect } from '@/components/sort_select';
import { isGoogleMapsApiEnabled } from '@/lib/google-maps';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';

export type RestaurantSortKey = 'relevance' | 'rating' | 'price' | 'distance';

export const sortFields: Record<RestaurantSortKey, SortKeyProps> = {
  relevance: {
    value: '菜品数量',
    order: ['desc'],
  },
  rating: {
    value: '评分',
    order: ['asc', 'desc'],
  },
  price: {
    value: '价格',
    order: ['asc', 'desc'],
  },
  distance: {
    value: '距离',
    order: ['asc', 'desc'],
  },
};

const Sort = ({
  className,
  current,
  setCurrent,
}: {
  className?: string;
  current: [keyof typeof sortFields, SortOrder];
  setCurrent: Dispatch<SetStateAction<[keyof typeof sortFields, SortOrder]>>;
}) => {
  if (!isGoogleMapsApiEnabled()) {
    delete sortFields['distance' as RestaurantSortKey];
  }

  return (
    <SortSelect
      className={cn('bg-white w-full md:w-64', className)}
      items={sortFields}
      current={current}
      setCurrent={setCurrent as Dispatch<SetStateAction<[string, SortOrder]>>}
    />
  );
};

export default Sort;
