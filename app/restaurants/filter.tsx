import Rating from '@/components/rating';
import {
  Sidebar,
  SidebarSelectedFilter,
  SidebarSeparator,
  SidebarSubTitle,
  SidebarTitle,
  SidebarToggleGroup,
} from '@/components/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { isGoogleMapsApiEnabled } from '@/lib/google-maps';
import { fetchWeatApi } from '@/lib/utils';
import { RestaurantCategory } from '@prisma/client';
import { Loader2, MapPinIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

const getCategories = async () => await fetchWeatApi('categories');

export default function Filter({
  className,
  selectedCategories,
  setSelectedCategories,
  selectedPrices,
  setSelectedPrices,
  selectedRating,
  setSelectedRating,
  selectedDistance,
  setSelectedDistance,
  setUpdatingDistance,
  currentLocation,
  sidebarOpen,
  setSidebarOpen,
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
  setUpdatingDistance: Dispatch<SetStateAction<boolean>>;
  currentLocation: [number, number] | string | null;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [categories, setCategories] = useState<string[]>();
  useEffect(() => {
    getCategories().then((data: RestaurantCategory[]) =>
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

  const filtersContent = useMemo(
    () => (
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

        <SidebarSubTitle>评分</SidebarSubTitle>
        <Rating value={selectedRating} onValueChange={setSelectedRating} />
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

        {isGoogleMapsApiEnabled() && (
          <>
            <SidebarSeparator />
            <SidebarSubTitle>距离</SidebarSubTitle>
            <Slider
              // 16px diameter circle - 6px height bar = 10px diameter => 5px radius
              className="py-[5px] pb-4"
              max={50}
              value={[selectedDistance]}
              onValueChange={(value) => {
                setUpdatingDistance(true);
                setSelectedDistance(value[0]);
              }}
              onValueCommit={() => setUpdatingDistance(false)}
            />
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <p>{selectedDistance ? `${selectedDistance} mi 以内` : '不限'}</p>
              <p className="inline-flex gap-0.5 items-center">
                {currentLocation ? (
                  Array.isArray(currentLocation) ? (
                    <>
                      <MapPinIcon size={12} className="self-center" />
                      <a
                        href={`https://www.google.com/maps/@${currentLocation.join(',')},15z`}
                        target="_blank"
                        title="在 Google 地图中打开"
                        className="hover:underline"
                      >
                        {currentLocation.join(', ')}
                      </a>
                    </>
                  ) : (
                    currentLocation
                  )
                ) : (
                  <>
                    定位中
                    <Loader2 className="animate-spin" size={12} />
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </Sidebar>
    ),
    [
      categories,
      className,
      currentLocation,
      selectedCategories,
      selectedDistance,
      selectedFiltersStrings,
      selectedPrices,
      selectedRating,
      setSelectedCategories,
      setSelectedDistance,
      setSelectedPrices,
      setSelectedRating,
      setUpdatingDistance,
    ],
  );

  return (
    <>
      <div className="block md:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent side="left">{filtersContent}</SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block">{filtersContent}</div>
    </>
  );
}
