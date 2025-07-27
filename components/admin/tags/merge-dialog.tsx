import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/api";
import {
  SELECTED_SUGGESTED_TAG_BADGE_COLOR,
  SELECTED_TAG_BADGE_COLOR,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { type APIError, type Tag, type TagCluster } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import {
  Check,
  CheckIcon,
  ChevronsUpDown,
  Loader2,
  MergeIcon,
  NetworkIcon,
  SparklesIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const MAX_CLUSTERS_TO_SHOW = 50;

interface MergeDialogProps {
  clusters: TagCluster[];
  selectedTags: Set<Tag>;
  open: boolean;
  setOpen: (open: boolean) => void;
  onComplete: () => void;
}

export const MergeDialog = ({
  clusters,
  selectedTags,
  open,
  setOpen,
  onComplete,
}: MergeDialogProps) => {
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter clusters: show first 50 by default, all matches when searching
  const filteredClusters = searchQuery
    ? clusters.filter((cluster) =>
        cluster.display_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : clusters.slice(0, MAX_CLUSTERS_TO_SHOW);

  const [selectedClusterId, setSelectedClusterId] = useState<
    string | null | undefined
  >(null);

  const selectedCluster = clusters.find(
    (cluster) => cluster.id === selectedClusterId,
  );

  const tagSuggestionsMutation = useMutation<
    Tag[],
    APIError,
    { clusterId: string | null; tagIds: string[] }
  >({
    mutationFn: async ({ clusterId, tagIds }) => {
      const res = await api.post(
        `/admin/tags/clusters/${clusterId}/suggestions`,
        {
          tag_ids: tagIds,
        },
      );

      return res.data;
    },
    onError: (error) => {
      console.error(error);

      toast.error("Failed to get tag suggestions", {
        description: error.error,
      });
    },
  });

  const [selectedSuggestedTags, setSelectedSuggestedTags] = useState<
    Set<string>
  >(new Set());

  // Memoized, deduplicated tag IDs for merge
  const tagIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...Array.from(selectedTags).map((tag) => tag.id),
          ...Array.from(selectedSuggestedTags),
        ]),
      ),
    [selectedTags, selectedSuggestedTags],
  );

  useEffect(() => {
    if (open && selectedClusterId && selectedTags.size > 0) {
      tagSuggestionsMutation.mutate({
        clusterId: selectedClusterId,
        tagIds: Array.from(selectedTags).map((tag) => tag.id),
      });
    } else if (open) {
      tagSuggestionsMutation.reset();
    }
    // Do not clear selectedSuggestedTags here; let dialog close effect handle it
  }, [open, selectedClusterId, selectedTags, tagSuggestionsMutation]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedClusterId(null);
      setSelectedSuggestedTags(new Set());
      setSearchQuery("");
      setSearchBarOpen(false);
      tagSuggestionsMutation.reset();
    }
  }, [open, tagSuggestionsMutation]);

  const mergeMutation = useMutation<
    Tag[],
    APIError,
    { clusterId: string; tagIds: string[] }
  >({
    mutationFn: ({ clusterId, tagIds }) => {
      if (!clusterId) {
        throw new Error("No cluster selected");
      }

      if (tagIds.length === 0) {
        throw new Error("No tags to merge");
      }

      return api.post("/admin/tags/clusters/merge", {
        tag_cluster_id: clusterId,
        tag_ids: tagIds,
      });
    },
    onSuccess: () => {
      setOpen(false);
      setSelectedClusterId(null);
      onComplete();

      toast.success("Tags added successfully", {
        description: `${selectedTags.size + selectedSuggestedTags.size} tag${
          selectedTags.size + selectedSuggestedTags.size !== 1 ? "s" : ""
        }
        added to ${selectedCluster?.display_name}`,
      });
    },
    onError: (error) => {
      console.error(error);

      toast.error("Failed to merge tags", {
        description: error.error,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer"
          disabled={selectedTags.size === 0}
          size={"sm"}
        >
          <MergeIcon />
          Merge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MergeIcon className="size-5" />
            Merge Tags to Cluster
          </DialogTitle>
        </DialogHeader>
        <Popover open={searchBarOpen} onOpenChange={setSearchBarOpen}>
          <div className="flex flex-col gap-2">
            <Label>
              <NetworkIcon className="size-4" />
              Cluster
            </Label>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={searchBarOpen}
                className="w-full cursor-pointer justify-between"
              >
                {selectedCluster?.display_name ?? "Select cluster..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              // https://github.com/shadcn-ui/ui/issues/607#issuecomment-1610187963
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <Command>
                <CommandInput
                  placeholder="Search cluster..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList className="max-h-64">
                  <CommandEmpty>No cluster found.</CommandEmpty>
                  <CommandGroup>
                    {filteredClusters.map((cluster) => (
                      <CommandItem
                        key={cluster.id}
                        value={cluster.display_name}
                        className="cursor-pointer"
                        onSelect={(currentValue) => {
                          const selectedCluster = clusters.find(
                            (cluster) => cluster.display_name === currentValue,
                          );
                          setSelectedClusterId(selectedCluster?.id);
                          setSearchBarOpen(false);
                        }}
                      >
                        {cluster.display_name}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedClusterId === cluster.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                    {!searchQuery && clusters.length > MAX_CLUSTERS_TO_SHOW && (
                      <CommandItem value="more" disabled>
                        ... and {clusters.length - MAX_CLUSTERS_TO_SHOW} more
                        clusters
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </div>
          <div className="flex flex-col gap-2">
            <Label>
              <CheckIcon className="text-success size-4" />
              Selected
            </Label>
            <div className="flex flex-wrap items-center gap-1">
              {Array.from(selectedTags).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className={cn("select-none", SELECTED_TAG_BADGE_COLOR)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>
              <SparklesIcon className="size-4 text-violet-500" />
              Suggested
            </Label>
            <div className="flex flex-wrap items-center gap-1">
              {tagSuggestionsMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : tagSuggestionsMutation.data &&
                tagSuggestionsMutation.data.length > 0 ? (
                tagSuggestionsMutation.data.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className={cn(
                      "cursor-pointer select-none",
                      selectedSuggestedTags.has(tag.id)
                        ? SELECTED_SUGGESTED_TAG_BADGE_COLOR
                        : "",
                    )}
                    onClick={() => {
                      setSelectedSuggestedTags((prev) => {
                        const newSet = new Set(prev);

                        if (newSet.has(tag.id)) {
                          newSet.delete(tag.id);
                        } else {
                          newSet.add(tag.id);
                        }

                        return newSet;
                      });
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No suggestions found
                </p>
              )}
            </div>
          </div>
        </Popover>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => {
              if (!selectedClusterId || tagIds.length === 0) {
                return;
              }

              mergeMutation.mutate({
                clusterId: selectedClusterId,
                tagIds,
              });
            }}
            disabled={
              !selectedClusterId ||
              tagIds.length === 0 ||
              mergeMutation.isPending
            }
          >
            {mergeMutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : null}
            Merge {selectedTags.size + selectedSuggestedTags.size} Tag
            {selectedTags.size + selectedSuggestedTags.size !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
