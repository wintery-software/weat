import { MergeDialog } from "@/components/admin/tags/merge-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SELECTED_TAG_BADGE_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Tag, TagCluster } from "@/types/types";
import { XIcon } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

interface SelectedTagsCardProps {
  selectedTags: Set<Tag>;
  setSelectedTags: Dispatch<SetStateAction<Set<Tag>>>;
  clusters: (TagCluster & { tags: Tag[] })[];
  mergeDialogOpen: boolean;
  setMergeDialogOpen: (open: boolean) => void;
  onMergeComplete: () => void;
}

export const SelectedTagsCard = ({
  selectedTags,
  setSelectedTags,
  clusters,
  mergeDialogOpen,
  setMergeDialogOpen,
  onMergeComplete,
}: SelectedTagsCardProps) => {
  return (
    <Card
      className={cn(
        "sticky bottom-4 z-10 shadow-md transition-all duration-150 ease-in-out",
        selectedTags.size > 0
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <CardContent className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <p className="shrink-0 text-sm font-medium">Selected Tags</p>
          <div className="flex flex-wrap gap-1">
            {Array.from(selectedTags).map((tag) => (
              <Badge
                key={tag.id}
                variant={"outline"}
                className={cn(
                  "cursor-pointer transition-colors select-none",
                  SELECTED_TAG_BADGE_COLOR,
                )}
                onClick={() => {
                  setSelectedTags((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(tag);

                    return newSet;
                  });
                }}
              >
                {tag.name}
                <XIcon />
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 md:flex-row">
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => setSelectedTags(new Set())}
            className="cursor-pointer"
            disabled={selectedTags.size === 0}
          >
            Clear
          </Button>
          <MergeDialog
            clusters={clusters}
            selectedTags={selectedTags}
            open={mergeDialogOpen}
            setOpen={setMergeDialogOpen}
            onComplete={onMergeComplete}
          />
        </div>
      </CardContent>
    </Card>
  );
};
