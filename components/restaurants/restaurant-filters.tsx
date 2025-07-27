"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DEFAULT_RESTAURANT_QUERY,
  DEFAULT_RESTAURANT_SORT_BY,
} from "@/lib/constants";
import { kilometersToMiles } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { SortOption, ViewMode } from "@/types/types";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Grid3x3Icon,
  ListIcon,
  MapIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  RouteIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  StarIcon,
  XIcon,
} from "lucide-react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface RestaurantFiltersProps {
  filters: {
    sortBy: SortOption;
    distance: number;
    query: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      sortBy: SortOption;
      distance: number;
      query: string;
    }>
  >;
  sliderValue: number;
  setSliderValue: (v: number) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  userLocation: UserLocation | null;
  geoPermission: PermissionState | null;
  totalCount: number;
  onRequestLocation: () => void;
}

const SORT_OPTIONS: { label: string; icon?: React.ReactNode; value: string }[] =
  [
    { label: "默认排序", value: "default" },
    {
      label: "距离最近",
      icon: (
        <>
          <RouteIcon />
          <ChevronDownIcon />
        </>
      ),
      value: "distance:asc",
    },
    {
      label: "距离最远",
      icon: (
        <>
          <RouteIcon />
          <ChevronUpIcon />
        </>
      ),
      value: "distance:desc",
    },
    {
      label: "评分最低",
      icon: (
        <>
          <StarIcon />
          <ChevronDownIcon />
        </>
      ),
      value: "rating:asc",
    },
    {
      label: "评分最高",
      icon: (
        <>
          <StarIcon />
          <ChevronUpIcon />
        </>
      ),
      value: "rating:desc",
    },
    {
      label: "评价最少",
      icon: (
        <>
          <MessageSquareIcon />
          <ChevronDownIcon />
        </>
      ),
      value: "review_count:asc",
    },
    {
      label: "评价最多",
      icon: (
        <>
          <MessageSquareIcon />
          <ChevronUpIcon />
        </>
      ),
      value: "review_count:desc",
    },
  ];

export const RestaurantFilters = ({
  filters,
  setFilters,
  sliderValue,
  setSliderValue,
  isFilterOpen,
  setIsFilterOpen,
  view,
  setView,
  userLocation,
  geoPermission,
  totalCount,
  onRequestLocation,
}: RestaurantFiltersProps) => {
  return (
    <div
      id="search-filters"
      className="bg-background sticky top-(--header-height) z-10 py-2 md:py-4"
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="搜索餐厅名称..."
            className="pl-9 text-sm"
            value={filters.query}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, query: e.target.value }))
            }
          />
        </div>
        {/* Filter Button and View Tabs */}
        <div className="flex items-center gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <SlidersHorizontalIcon className="size-4" />
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">筛选</span>
                  <span className="text-muted-foreground text-xs">
                    {totalCount}
                  </span>
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>筛选餐厅</SheetTitle>
                <SheetDescription>
                  使用这些筛选条件缩小搜索范围
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6 px-4">
                {/* Sort Dropdown */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sort-by">排序方式</Label>
                  <Select
                    value={filters.sortBy ?? ""}
                    onValueChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: value as SortOption,
                      }));
                    }}
                  >
                    <SelectTrigger id="sort-by" className="w-full">
                      <SelectValue placeholder="选择排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.icon}
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Distance Filter */}
                <div className="flex flex-col gap-3">
                  <Label htmlFor="distance-slider">距离</Label>
                  <Slider
                    id="distance-slider"
                    value={[sliderValue]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => {
                      setSliderValue(value[0]);
                    }}
                    onValueCommit={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        distance: value[0],
                      }));
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {sliderValue === 0
                        ? "All"
                        : `${kilometersToMiles(sliderValue).toFixed(1)} mi`}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {sliderValue !== 0 && `${sliderValue} km`}
                    </span>
                  </div>
                </div>
                {/* Current Location */}
                <div className="flex flex-col gap-2">
                  <Label>当前定位</Label>
                  <div className="space-y-2 text-xs">
                    {geoPermission === "denied" ? (
                      <p className="text-destructive">
                        定位权限被拒绝，请在浏览器设置中启用定位权限。
                      </p>
                    ) : userLocation ? (
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground font-mono">
                          {userLocation.latitude.toFixed(7)},&nbsp;
                          {userLocation.longitude.toFixed(7)}
                        </p>
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={onRequestLocation}
                          disabled={geoPermission !== "granted"}
                          className="size-4 cursor-pointer"
                        >
                          <RefreshCwIcon
                            className={cn(
                              geoPermission === "prompt" && "animate-spin",
                            )}
                          />
                        </Button>
                      </div>
                    ) : geoPermission === "prompt" ? (
                      <p className="text-muted-foreground">
                        正在获取定位，请在浏览器设置中启用定位权限。
                      </p>
                    ) : (
                      <p className="text-muted-foreground">未获取定位</p>
                    )}
                  </div>
                </div>
              </div>
              <SheetFooter className="mt-6 flex-row justify-between sm:space-x-0">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      sortBy: DEFAULT_RESTAURANT_SORT_BY,
                      distance: 0,
                      query: DEFAULT_RESTAURANT_QUERY,
                    })
                  }
                >
                  清除
                </Button>
                <Button onClick={() => setIsFilterOpen(false)}>应用</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {/* View Toggle */}
          <ToggleGroup
            type="single"
            value={view}
            variant={"outline"}
            onValueChange={(value) => value && setView(value as ViewMode)}
            className="flex-shrink-0"
          >
            <ToggleGroupItem value="grid" aria-label="网格视图">
              <Grid3x3Icon className="size-4" />
              <span className="hidden sm:inline">网格</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="列表视图">
              <ListIcon className="size-4" />
              <span className="hidden sm:inline">列表</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="map" aria-label="地图视图">
              <MapIcon className="size-4" />
              <span className="hidden sm:inline">地图</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      {/* Active Filters */}
      {(filters.sortBy !== DEFAULT_RESTAURANT_SORT_BY ||
        filters.query ||
        filters.distance > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.query && (
            <Badge
              variant="secondary"
              className="flex cursor-pointer items-center gap-1 select-none"
              onClick={() => setFilters((prev) => ({ ...prev, query: "" }))}
            >
              搜索:&nbsp;{filters.query}
              <XIcon className="h-3 w-3" />
            </Badge>
          )}
          {filters.sortBy && filters.sortBy !== DEFAULT_RESTAURANT_SORT_BY && (
            <Badge
              variant="secondary"
              className="flex cursor-pointer items-center gap-1 select-none"
              onClick={() => {
                setFilters((prev) => ({ ...prev, sortBy: "default" }));
              }}
            >
              排序:&nbsp;
              {
                SORT_OPTIONS.find((option) => option.value === filters.sortBy)
                  ?.label
              }
              <XIcon className="h-3 w-3" />
            </Badge>
          )}
          {filters.distance > 0 && (
            <Badge
              variant="secondary"
              className="flex cursor-pointer items-center gap-1 select-none"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  distance: 0,
                }));
                setSliderValue(0);
              }}
            >
              距离:&nbsp;&le;&nbsp;
              {kilometersToMiles(filters.distance).toFixed(1)} mi
              <XIcon className="h-3 w-3" />
            </Badge>
          )}
          {filters.sortBy !== DEFAULT_RESTAURANT_SORT_BY ||
          filters.query ||
          filters.distance > 0 ? (
            <Badge
              variant={"outline"}
              className="flex cursor-pointer items-center gap-1 select-none"
              onClick={() =>
                setFilters({
                  sortBy: DEFAULT_RESTAURANT_SORT_BY,
                  distance: 0,
                  query: DEFAULT_RESTAURANT_QUERY,
                })
              }
            >
              清除所有
            </Badge>
          ) : null}
        </div>
      )}
    </div>
  );
};
