"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export const RestaurantFilters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [distance, setDistance] = useState([5]);

  const handleAddFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setDistance([5]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input placeholder="搜索餐厅..." className="pl-9" />
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex cursor-pointer gap-2 bg-transparent"
            >
              <SlidersHorizontal className="size-4" />
              筛选
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>筛选餐厅</SheetTitle>
              <SheetDescription>使用这些筛选条件缩小搜索范围</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6 px-4">
              <div className="space-y-2">
                <Label>距离</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={distance}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={setDistance}
                  />
                  <span className="w-16 text-center text-sm font-medium">
                    {distance[0]} mi
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="flex gap-2">
                  {["$", "$$", "$$$", "$$$$"].map((price) => (
                    <Button
                      key={price}
                      variant={
                        activeFilters.includes(price) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        activeFilters.includes(price)
                          ? handleRemoveFilter(price)
                          : handleAddFilter(price)
                      }
                    >
                      {price}
                    </Button>
                  ))}
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cuisine">
                  <AccordionTrigger>菜系</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Sichuan",
                        "Cantonese",
                        "Taiwanese",
                        "Shanghainese",
                        "Hunan",
                        "Dim Sum",
                      ].map((cuisine) => (
                        <Button
                          key={cuisine}
                          variant={
                            activeFilters.includes(cuisine)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            activeFilters.includes(cuisine)
                              ? handleRemoveFilter(cuisine)
                              : handleAddFilter(cuisine)
                          }
                        >
                          {cuisine}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="features">
                  <AccordionTrigger>特色</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Spicy",
                        "Vegetarian Options",
                        "Authentic",
                        "Family Style",
                        "Hotpot",
                      ].map((feature) => (
                        <Button
                          key={feature}
                          variant={
                            activeFilters.includes(feature)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            activeFilters.includes(feature)
                              ? handleRemoveFilter(feature)
                              : handleAddFilter(feature)
                          }
                        >
                          {feature}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <SheetFooter className="mt-6 flex-row justify-between sm:space-x-0">
              <Button variant="outline" onClick={handleClearFilters}>
                清除
              </Button>
              <Button onClick={() => setIsOpen(false)}>应用</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveFilter(filter)}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={handleClearFilters}
          >
            清除所有
          </Button>
        </div>
      )}
    </div>
  );
};
