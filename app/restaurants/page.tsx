import DataLayout from '@/app/layouts/data_layout';
import Content from '@/app/restaurants/content';
import Filter from '@/app/restaurants/filter';

export default function Restaurants() {
  return (
    <DataLayout
      filter={<Filter className="col-span-1 hidden md:block" />}
      content={<Content />}
    />
  );
}
