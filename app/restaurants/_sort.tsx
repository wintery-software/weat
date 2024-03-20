import { SortKeyProps, SortOrder, SortSelect } from '@/components/sort_select';
import { Button } from '@/components/ui/button';
import { isGoogleMapsApiEnabled } from '@/lib/google-maps';
import { IconFilter } from '@tabler/icons-react';
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
  current,
  setCurrent,
  setSidebarOpen,
}: {
  current: [keyof typeof sortFields, SortOrder];
  setCurrent: Dispatch<SetStateAction<[keyof typeof sortFields, SortOrder]>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  if (!isGoogleMapsApiEnabled()) {
    delete sortFields['distance' as RestaurantSortKey];
  }

  return (
    <div className="md:self-center flex gap-1">
      <Button
        className="flex md:hidden bg-transparent"
        variant="outline"
        size="icon"
        onClick={() => {
          setSidebarOpen(true);
        }}
      >
        <IconFilter size={14} />
      </Button>
      <SortSelect
        items={sortFields}
        current={current}
        setCurrent={setCurrent as Dispatch<SetStateAction<[string, SortOrder]>>}
      />
    </div>
  );
};

export default Sort;
