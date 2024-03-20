import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';

export interface SortKeyProps {
  value: string;
  order: SortOrder[];
}

export type SortOrder = 'asc' | 'desc';

export const sortOrders: Record<SortOrder, string> = {
  asc: '从低到高',
  desc: '从高到低',
};

export const SortSelect = ({
  items,
  current,
  setCurrent,
  className = 'w-48',
}: {
  items: Record<string, SortKeyProps>;
  current: [keyof typeof items, SortOrder];
  setCurrent: Dispatch<SetStateAction<[keyof typeof items, SortOrder]>>;
  className?: string;
}) => (
  <Select
    required
    value={current.join(':')}
    onValueChange={(value) =>
      setCurrent(value.split(':') as [keyof typeof items, SortOrder])
    }
  >
    <SelectTrigger value={current.join(':')} className={className}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {Object.entries(items).map(([key, props]) =>
        props.order.map((order, index) => (
          <SelectItem key={index} value={`${key}:${order}`}>
            {props.value}: {sortOrders[order]} {order === 'asc' ? '↑' : '↓'}
          </SelectItem>
        )),
      )}
    </SelectContent>
  </Select>
);
