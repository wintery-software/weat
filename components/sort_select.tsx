import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortOrdersType } from '@/lib/constants';
import { Dispatch, SetStateAction } from 'react';

const sortOrders = {
  asc: '从低到高',
  desc: '从高到低',
};

export default function SortSelect({
  sortFields,
  sortBy,
  setSortBy,
}: {
  sortFields: Record<string, string>;
  sortBy: [keyof typeof sortFields, keyof SortOrdersType];
  setSortBy: Dispatch<
    SetStateAction<[keyof typeof sortFields, keyof SortOrdersType]>
  >;
}) {
  return (
    <Select
      required
      value={sortBy.join(':')}
      onValueChange={(value) =>
        setSortBy(
          value.split(':') as [keyof typeof sortFields, keyof SortOrdersType],
        )
      }
    >
      <SelectTrigger value={sortBy.join(':')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        {Object.entries(sortFields).map(([fieldValue, fieldText]) =>
          Object.entries(sortOrders).map(([orderValue, orderText], index) => (
            <SelectItem key={index} value={`${fieldValue}:${orderValue}`}>
              {fieldText}: {orderText} {orderValue === 'asc' ? '↑' : '↓'}
            </SelectItem>
          )),
        )}
      </SelectContent>
    </Select>
  );
}
