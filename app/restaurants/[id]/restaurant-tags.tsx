"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RestaurantTagsProps {
  tags: Array<{
    tag: { name: string };
    mention_count: number;
  }>;
}

export const RestaurantTags = ({ tags }: RestaurantTagsProps) => {
  const [showAllTags, setShowAllTags] = useState(false);

  const popularTags = tags.filter((tag) => tag.mention_count > 1);
  const nonPopularTags = tags.filter((tag) => tag.mention_count === 1);
  const hasNonPopularTags = nonPopularTags.length > 0;
  const filteredTags = showAllTags ? tags : popularTags;

  return (
    <>
      <h3 className="text-lg font-semibold">标签</h3>
      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tagData, i: number) => (
          <Badge
            key={i}
            variant={"outline"}
            className="hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-300 select-none"
          >
            {tagData.tag.name}
            <span className="text-muted-foreground ml-1">
              {tagData.mention_count}
            </span>
          </Badge>
        ))}
      </div>
      {hasNonPopularTags && (
        <div className="flex justify-center">
          <Button
            variant={"outline"}
            className="hover:bg-background bg-transparent"
            size={"sm"}
            onClick={() => setShowAllTags(!showAllTags)}
          >
            {showAllTags
              ? "隐藏非热门标签"
              : `显示所有标签 (${nonPopularTags.length}+)`}
          </Button>
        </div>
      )}
    </>
  );
};
