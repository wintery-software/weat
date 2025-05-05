import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { WeatAPI } from "@/lib/api";
import type { API } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { LucideTrash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface DeletePlaceDialogContentProps {
  place: API.Place;
}

export const DeletePlaceDialog = ({ place }: DeletePlaceDialogContentProps) => {
  const { id, name } = place;
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const deletePlaceMutation = useMutation({
    mutationFn: async () =>
      await WeatAPI.delete(`/admin/places/${id}`, {
        headers: {
          Authorization: `Bearer ${session!.accessToken}`,
        },
      }),
    onSuccess: () => {
      // Invalidate the query to refetch the data
      // This is a placeholder, replace with your actual query invalidation logic
      console.log("Place deleted successfully");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
          <LucideTrash />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Place</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p>
                Are you sure you want to delete the place&nbsp;&quot;
                <Link href={`/places/${id}`} className="font-medium text-link underline" target="_blank">
                  {name}
                </Link>
                &quot;?
              </p>
              <p>This action cannot be undone.</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            autoFocus={false}
            onClick={() => {
              setIsOpen(false);

              toast.promise(deletePlaceMutation.mutateAsync(), {
                loading: `Deleting place "${name}"...`,
                success: () => {
                  return `Place "${name}" deleted.`;
                },
                error: (error) => {
                  return `Failed to delete place "${name}": ${error.message}`;
                },
              });
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
