import SortSelect from '@/components/sort_select';
import { Button } from '@/components/ui/button';
import { RestaurantSortFieldsType, SortOrdersType } from '@/lib/constants';
import { isGoogleMapsApiEnabled } from '@/lib/google-maps';
import { IconFilter } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';

const sortFields: RestaurantSortFieldsType = {
  rating: '评分',
  price: '价格',
  distance: '距离',
};


const Sort = ({
  sortBy,
  setSortBy,
  setSidebarOpen,
}: {
  sortBy: [keyof RestaurantSortFieldsType, keyof SortOrdersType];
  setSortBy: Dispatch<
    SetStateAction<[keyof RestaurantSortFieldsType, keyof SortOrdersType]>
  >;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  if (!isGoogleMapsApiEnabled()) {
    delete sortFields.distance;
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
        sortFields={sortFields as unknown as Record<string, string>}
        sortBy={sortBy}
        setSortBy={
          setSortBy as Dispatch<SetStateAction<[string, keyof SortOrdersType]>>
        }
      />
    </div>
  );
};

export default Sort;
