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
import { useSuspenseRestaurants } from "@/hooks/use-restaurants";
import { ChevronLeft, ChevronRight, Grid3x3, List } from "lucide-react";
import { useState } from "react";

export const RestaurantResults = () => {
  const [view, setView] = useState("grid");
  const [pageSize, setPageSize] = useState(30);
  const [page, setPage] = useState(1);
  const { data: restaurants } = useSuspenseRestaurants();

  const totalPages = Math.ceil(restaurants.length / pageSize);
  const paginatedRestaurants = restaurants.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          找到 {restaurants.length} 家餐厅
        </p>
        <div className="flex items-center gap-4">
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
          <Tabs defaultValue="grid" value={view} onValueChange={setView}>
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
      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          第 {page} / {totalPages} 页
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="mr-1 size-4" />
            上一页
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            下一页
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
