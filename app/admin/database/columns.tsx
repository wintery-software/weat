"use client";

import { DeletePlaceDialog } from "@/app/admin/database/delete-place-dialog";
import PlaceForm from "@/app/admin/database/place-form";
import { DataTableColumnHeader } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { API } from "@/types/api";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/github.css";
import { LucideCopy, LucideCurlyBraces, LucideEllipsis, LucideInfo, LucidePencil } from "lucide-react";

hljs.registerLanguage("json", json);

const columnHelper = createColumnHelper<API.Place>();

export const columns: ColumnDef<API.Place, never>[] = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 36,
    enableHiding: false,
    enableSorting: false,
    enableResizing: false,
  }),
  columnHelper.accessor("id", {
    id: "ID",
    header: "ID",
    cell: (info) => (
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="flex items-center">
          <LucideInfo className="size-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono">{info.getValue()}</p>
        </TooltipContent>
      </Tooltip>
    ),
    size: 36,
    enableHiding: false,
    enableSorting: false,
    enableResizing: false,
  }),
  columnHelper.accessor("name", {
    id: "Name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  }),
  columnHelper.accessor("name_zh", {
    id: "Name (zh)",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name (zh)" />,
  }),
  columnHelper.accessor("type", {
    id: "Type",
    header: "Type",
  }),
  columnHelper.accessor((row) => row.location?.latitude, {
    id: "Latitude",
    header: "Latitude",
  }),
  columnHelper.accessor((row) => row.location?.longitude, {
    id: "Longitude",
    header: "Longitude",
  }),
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "google_maps_url",
    header: "Google Maps URL",
  },
  {
    accessorKey: "google_maps_place_id",
    header: "Google Maps Place ID",
    cell: (info) => (
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="flex items-center">
          <LucideInfo className="size-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono">{info.getValue()}</p>
        </TooltipContent>
      </Tooltip>
    ),
    size: 200,
    enableSorting: false,
    enableResizing: false,
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    accessorKey: "website_url",
    header: "Website URL",
  },
  {
    accessorKey: "opening_hours",
    header: "Opening Hours",
  },
  {
    accessorKey: "properties",
    header: "Properties (JSON)",
    cell: (info) => {
      const raw = JSON.stringify(info.getValue(), null, 2);
      const __html = hljs.highlight(raw, { language: "json" }).value;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <LucideCurlyBraces />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <pre className="bg-transparent text-xs" dangerouslySetInnerHTML={{ __html }} />
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <LucideEllipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <LucidePencil />
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Place</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <PlaceForm action={"update"} place={row.original} />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <LucideCopy />
                Duplicate
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Duplicate Place</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <PlaceForm action={"duplicate"} place={row.original} />
            </DialogContent>
          </Dialog>
          <DropdownMenuSeparator />
          <DeletePlaceDialog place={row.original} />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 36,
    enableHiding: false,
    enableSorting: false,
    enableResizing: false,
  }),
];
