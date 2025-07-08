"use client";

import { RestaurantCard } from "@/app/restaurants/restaurant-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSuspenseRestaurants } from "@/hooks/db/use-restaurants";
import { ResultViewMode } from "@/types/types";
import { ChevronLeft, ChevronRight, Grid3x3, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface RestaurantResultsProps {
  defaultPage: number;
  defaultPageSize: number;
  defaultView: ResultViewMode;
}

export const RestaurantResults = ({
  defaultPage,
  defaultPageSize,
  defaultView,
}: RestaurantResultsProps) => {
  const router = useRouter();
  const [view, setView] = useState<ResultViewMode>(defaultView);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(defaultPage);
  const { data: restaurants = [] } = useSuspenseRestaurants();

  const totalPages = useMemo(
    () => Math.ceil(restaurants.length / pageSize),
    [restaurants.length, pageSize],
  );

  useEffect(() => {
    if (page < 1) {
      setPage(1);
    } else if (page > totalPages) {
      setPage(totalPages);
    }

    // Update URL params
    router.push(`?page=${page}&page_size=${pageSize}&view=${view}`);
  }, [router, totalPages, page, pageSize, view]);

  const paginatedRestaurants = restaurants.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handlePageChange = (value: number) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <p className="text-muted-foreground text-sm">
          找到 {restaurants.length} 家餐厅
        </p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>每页显示</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                // Return to the first page
                setPage(1);
              }}
            >
              <SelectTrigger size="sm" className="w-20 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="60">60</SelectItem>
                <SelectItem value="120">120</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs
            defaultValue="grid"
            value={view}
            onValueChange={(value) => setView(value as ResultViewMode)}
          >
            <TabsList>
              <TabsTrigger value="grid" className="cursor-pointer">
                <Grid3x3 className="mr-1 size-4" />
                网格
              </TabsTrigger>
              <TabsTrigger value="list" className="cursor-pointer">
                <List className="mr-1 size-4" />
                列表
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <div className="text-muted-foreground text-sm">
          第&nbsp;
          <span className="text-primary font-semibold">{page}</span>
          &nbsp;/&nbsp;{totalPages} 页
        </div>
        <div className="flex gap-2">
          <Button
            size={"icon"}
            variant="outline"
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="mr-1 size-4" />
          </Button>
          <Button
            size={"icon"}
            variant="outline"
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>

      <div
        className={
          view === "grid"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }
      >
        {paginatedRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            view={view as "grid" | "list"}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-4">
        <div className="text-muted-foreground text-sm">
          第&nbsp;
          <span className="text-primary font-semibold">{page}</span>
          &nbsp;/&nbsp;{totalPages} 页
        </div>
        <div className="flex gap-2">
          <Button
            size={"icon"}
            variant="outline"
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="mr-1 size-4" />
          </Button>
          <Button
            size={"icon"}
            variant="outline"
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
