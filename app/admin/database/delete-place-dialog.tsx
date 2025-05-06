"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WeatAPI } from "@/lib/api";
import type { API } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LucideTrash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface DeletePlaceDialogProps {
  place: API.Place;
}

const DELETE_CONFIRMATION_STRING = "delete place";

export const DeletePlaceDialog = ({ place }: DeletePlaceDialogProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutatePlaceQuery = useMutation({
    mutationFn: async () => {
      const response = await WeatAPI.delete(`/admin/places/${place!.id}`, {
        headers: {
          Authorization: `Bearer ${session!.accessToken}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate the places query to refetch the data in the table
      // noinspection JSIgnoredPromiseFromCall
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleDelete = async () => {
    toast.promise(mutatePlaceQuery.mutateAsync(), {
      loading: `Deleting place ${place.name} (${place.id})...`,
      success: `Place ${place.name} (${place.id}) deleted successfully`,
      error: (error) => `Failed to delete place ${place.name} (${place.id}): ${error.message}`,
      duration: 5000,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-destructive data-[highlighted]:text-destructive"
          onSelect={(e) => e.preventDefault()}
        >
          <LucideTrash />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Place</DialogTitle>
          <DialogDescription className="font-mono text-xs">{place?.id}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1 text-sm">
            <p>
              Are you sure you want to delete the place&nbsp;
              <Link href={`/places/${place.id}`} className="font-medium text-link underline" target="_blank">
                {place.name}
              </Link>
              ?
            </p>
            <p>This action cannot be undone.</p>
          </div>
          <div>
            <Label htmlFor="delete-confirmation">
              To confirm deletion, type <i>{DELETE_CONFIRMATION_STRING}</i> into the text field.
            </Label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={"destructive"}
              onClick={handleDelete}
              disabled={deleteConfirmation !== DELETE_CONFIRMATION_STRING || mutatePlaceQuery.isPending}
            >
              <LucideTrash />
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
