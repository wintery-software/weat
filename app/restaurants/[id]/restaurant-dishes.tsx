"use client";

import { RestaurantData } from "@/app/api/restaurants/[id]/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Eye, EyeOff, MessageCircleMore, TrophyIcon } from "lucide-react";
import { useState } from "react";

interface RestaurantDishesProps {
  dishes: RestaurantData["dishes"];
}

export const RestaurantDishes = ({ dishes }: RestaurantDishesProps) => {
  const [showAllDishes, setShowAllDishes] = useState(false);
  const popularDishes = dishes.filter((dish) => dish.mention_count > 1);

  // Show at least 10 dishes by default, or all popular dishes if less than 10
  const defaultDishes =
    popularDishes.length >= 10 ? popularDishes : dishes.slice(0, 10);
  const filteredDishes = showAllDishes ? dishes : defaultDishes;

  // Show toggle button if there are dishes not shown by default
  const hiddenDishes = dishes.filter((dish) => !defaultDishes.includes(dish));
  const hasHiddenDishes = hiddenDishes.length > 0;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 select-none">
        <TrophyIcon className="size-5" />
        <h2>热门菜品</h2>
        <span className="text-muted-foreground text-sm font-normal">
          {dishes.length}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Top 3 Column */}
        <div className="flex flex-col gap-1">
          {filteredDishes.slice(0, 3).map((dish, index: number) => (
            <div
              key={index}
              className={`flex items-center gap-2 rounded-lg p-2 transition-all ${
                index === 0
                  ? "border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-100"
                  : index === 1
                    ? "border border-gray-200 bg-gradient-to-r from-gray-50 to-slate-100"
                    : "border border-orange-200 bg-gradient-to-r from-orange-50 to-red-100"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium ${
                  index === 0
                    ? "bg-yellow-200 text-white"
                    : index === 1
                      ? "bg-gray-100 text-white"
                      : "bg-orange-200 text-white"
                }`}
              >
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
              </span>
              <span className="text-foreground text-sm font-medium">
                {dish.name}
              </span>
              <Badge variant={"outline"} className="select-none">
                <MessageCircleMore className="size-3" />
                {dish.mention_count}
              </Badge>
            </div>
          ))}

          {/* Other dishes Grid */}
          {filteredDishes.length > 3 && (
            <div className="grid gap-0.5 md:grid-cols-2 md:gap-1">
              {filteredDishes.slice(3).map((dish, index: number) => (
                <div
                  key={index + 3}
                  className="hover:bg-muted flex items-center gap-2 rounded-lg px-2 py-1 transition-all md:py-2"
                >
                  <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-medium">
                    {index + 4}
                  </span>
                  <span className="text-sm">{dish.name}</span>
                  <Badge variant={"secondary"} className="select-none">
                    <MessageCircleMore className="size-3" />
                    {dish.mention_count}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      {hasHiddenDishes && (
        <CardFooter className="justify-center">
          <Button
            variant={"ghost"}
            className="hover:bg-background bg-transparent text-xs"
            size={"sm"}
            onClick={() => setShowAllDishes(!showAllDishes)}
          >
            {showAllDishes ? (
              <>
                <EyeOff className="mr-1 size-3" />
                仅显示热门
              </>
            ) : (
              <>
                <Eye className="mr-1 size-3" />
                显示所有 ({hiddenDishes.length}+)
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
