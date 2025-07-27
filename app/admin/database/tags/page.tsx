"use client";

import { SelectedTagsCard } from "@/components/admin/tags/selected-tags-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { SELECTED_TAG_BADGE_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { type Tag, type TagCluster } from "@/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

const Page = () => {
  const { data: clusters, refetch: refetchClusters } = useSuspenseQuery({
    queryKey: ["admin", "clusters"],
    queryFn: () => api.get("/admin/tags/clusters"),
    select: (res) => res.data as (TagCluster & { tags: Tag[] })[],
  });

  const [selectedTags, setSelectedTags] = useState<Set<Tag>>(new Set());
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h1>Clusters</h1>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {clusters.map((cluster) => (
          <div key={cluster.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {cluster.display_name}
                  <span className="text-muted-foreground text-sm font-normal">
                    {cluster.tags.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cluster.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={"outline"}
                      className={cn(
                        "cursor-pointer select-none",
                        selectedTags.has(tag) && SELECTED_TAG_BADGE_COLOR,
                      )}
                      onClick={() => {
                        setSelectedTags((prev) => {
                          const newSet = new Set(prev);

                          if (newSet.has(tag)) {
                            newSet.delete(tag);
                          } else {
                            newSet.add(tag);
                          }

                          return newSet;
                        });
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <SelectedTagsCard
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        clusters={clusters}
        mergeDialogOpen={mergeDialogOpen}
        setMergeDialogOpen={setMergeDialogOpen}
        onMergeComplete={() => {
          setSelectedTags(new Set());
          refetchClusters();
        }}
      />
    </div>
  );
};

export default Page;
