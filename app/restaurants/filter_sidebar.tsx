import Rating from '@/components/rating';
import {
  Sidebar,
  SidebarSelectedFilter,
  SidebarSeparator,
  SidebarSubTitle,
  SidebarTitle,
  SidebarToggleGroup,
} from '@/components/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Category } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const getCategories = async () => {
  const response = await fetch('http://localhost:3000/api/categories');
  return response.json();
};

export default function FilterSidebar({
  className,
  selectedCategories,
  setSelectedCategories,
  selectedPrices,
  setSelectedPrices,
  selectedRating,
  setSelectedRating,
  selectedDistance,
  setSelectedDistance,
}: {
  className?: string;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  selectedPrices: string[];
  setSelectedPrices: Dispatch<SetStateAction<string[]>>;
  selectedRating: number;
  setSelectedRating: Dispatch<SetStateAction<number>>;
  selectedDistance: number;
  setSelectedDistance: Dispatch<SetStateAction<number>>;
}) {
  const [categories, setCategories] = useState<string[]>();
  useEffect(() => {
    getCategories().then((data: Category[]) =>
      setCategories(data.map((c) => c.name)),
    );
  }, []);

  const selectedFiltersStrings = selectedCategories
    .concat(selectedPrices.map((p) => '$'.repeat(parseInt(p, 10))))
    .concat(
      selectedRating
        ? `${'★'.repeat(selectedRating)}` +
            (selectedRating < 5 ? ' 及以上' : '')
        : '',
    )
    .concat(selectedDistance ? `${selectedDistance} mi 以内` : '距离不限')
    .filter(Boolean);

  return (
    <Sidebar className={className}>
      <SidebarTitle>筛选</SidebarTitle>
      <SidebarSelectedFilter filters={selectedFiltersStrings} />
      <SidebarSeparator />

      <SidebarSubTitle>类别</SidebarSubTitle>
      {categories ? (
        <SidebarToggleGroup
          items={categories}
          value={selectedCategories}
          onValueChange={setSelectedCategories}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      )}
      <SidebarSeparator />

      <SidebarSubTitle>价格</SidebarSubTitle>
      <ToggleGroup
        className="flex-wrap justify-start"
        size="sm"
        type="multiple"
        variant="outline"
        value={selectedPrices}
        onValueChange={setSelectedPrices}
      >
        {Array.from({ length: 3 }, (_, i) => i + 1).map((value, index) => (
          <ToggleGroupItem
            className="text-xs"
            key={index}
            value={value.toString()}
          >
            {'$'.repeat(value)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <SidebarSeparator />

      <SidebarSubTitle>评分</SidebarSubTitle>
      <Rating value={selectedRating} onValueChange={setSelectedRating} />
      <SidebarSeparator />

      <SidebarSubTitle>距离</SidebarSubTitle>
      <Slider
        // 16px diameter circle - 6px height bar = 10px diameter => 5px radius
        className="py-[5px]"
        max={200}
        value={[selectedDistance]}
        onValueChange={(value) => {
          setSelectedDistance(value[0]);
        }}
      />
      <p className="pt-1 text-xs text-muted-foreground">
        {selectedDistance ? `${selectedDistance} mi 以内` : '不限'}
      </p>
    </Sidebar>
  );
}
