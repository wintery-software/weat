'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const Sidebar = ({ className, children }: { className?: string; children: any[] }) => (
  <nav className={className}>{children}</nav>
);

export const SidebarSelectedFilter = ({ filters }: { filters: string[] }) => {
  return (
    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
      {filters.map((filter, index) => (
        <span key={index} className="after:content-['·'] after:ml-1 last:after:content-none">
          {filter}
        </span>
      ))}
    </div>
  );
};

export const SidebarSeparator = () => <Separator className="my-4" />;

export const SidebarTitle = ({ children }: any) => <p className="text-base font-bold mb-2">{children}</p>;

export const SidebarSubTitle = ({ children }: any) => <p className="text-sm font-bold mb-2">{children}</p>;

export const SidebarToggleGroup = ({
  defaultPageSize = 8,
  increment = 8,
  items,
  onValueChange,
  value,
}: {
  defaultPageSize?: number;
  increment?: number;
  items: any[];
  onValueChange: Dispatch<SetStateAction<string[]>>;
  value: string[];
}) => {
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [displayingItems, setDisplayingItems] = useState<any[]>(items.slice(0, defaultPageSize));
  const hasMore = displayingItems.length < items.length;

  useEffect(() => {
    setDisplayingItems(items.slice(0, pageSize));
  }, [items, pageSize]);

  const showMore = () => {
    setPageSize(pageSize + increment);
  };

  return (
    <>
      <ToggleGroup
        className="flex-wrap justify-start pb-2"
        size="sm"
        type="multiple"
        variant="outline"
        value={value}
        onValueChange={onValueChange}
      >
        {displayingItems.map((item, index) => (
          <ToggleGroupItem className="text-xs" key={index} value={item.toString()}>
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {hasMore && (
        <Button
          className="p-0 h-auto justify-start text-xs font-semibold text-sky-600 hover:underline-offset-1"
          variant="link"
          onClick={showMore}
        >
          再显示 {Math.min(items.length - displayingItems.length, increment)} 个
        </Button>
      )}
    </>
  );
};
