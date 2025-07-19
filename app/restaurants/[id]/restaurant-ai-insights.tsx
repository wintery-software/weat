"use client";

import { type RestaurantData } from "@/app/api/restaurants/[id]/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AI_NAME } from "@/lib/constants";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RestaurantAiInsightsProps {
  restaurant: RestaurantData;
}

export const RestaurantAiInsights = ({
  restaurant,
}: RestaurantAiInsightsProps) => {
  const [showAllTags, setShowAllTags] = useState(false);

  const popularTags = restaurant.tags.filter((tag) => tag.mention_count > 1);
  const nonPopularTags = restaurant.tags.filter(
    (tag) => tag.mention_count === 1,
  );
  const hasNonPopularTags = nonPopularTags.length > 0;
  const filteredTags = showAllTags ? restaurant.tags : popularTags;

  return (
    <Card className="bg-gradient-to-br from-rose-50 via-white via-25% to-violet-50">
      <CardHeader className="flex items-center gap-2 select-none">
        <Sparkles className="text-violet-600" />
        <h2 className="bg-gradient-to-r from-violet-500 to-rose-400 bg-clip-text text-transparent select-none">
          {AI_NAME}
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3>评测</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {restaurant.summary?.summary || "暂无分析内容"}
            </ReactMarkdown>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3>标签</h3>
            <span className="text-muted-foreground text-sm">
              {restaurant.tags.length}
            </span>
          </div>
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
        </div>
      </CardContent>
      {hasNonPopularTags && (
        <CardFooter className="justify-center">
          <Button
            variant={"ghost"}
            className="hover:bg-background bg-transparent text-xs"
            size={"sm"}
            onClick={() => setShowAllTags(!showAllTags)}
          >
            {showAllTags ? (
              <>
                <EyeOff className="mr-1 size-3" />
                仅显示热门
              </>
            ) : (
              <>
                <Eye className="mr-1 size-3" />
                显示所有 ({nonPopularTags.length}+)
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
