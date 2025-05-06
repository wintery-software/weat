"use client";

import { DeletePlaceDialog } from "@/app/admin/database/delete-place-dialog";
import { PlaceDialog } from "@/app/admin/database/place-dialog";
import { DataTableColumnHeader } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { LucideCurlyBraces, LucideEllipsis, LucideInfo } from "lucide-react";
import Link from "next/link";

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
    size: 300,
    minSize: 150,
  }),
  columnHelper.accessor("name_zh", {
    id: "Name (zh)",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name (zh)" />,
    size: 200,
    minSize: 150,
  }),
  columnHelper.accessor("type", {
    id: "Type",
    header: "Type",
    minSize: 150,
  }),
  columnHelper.accessor((row) => row.location?.latitude, {
    id: "Latitude",
    header: "Latitude",
    minSize: 150,
  }),
  columnHelper.accessor((row) => row.location?.longitude, {
    id: "Longitude",
    header: "Longitude",
    minSize: 150,
  }),
  {
    accessorKey: "address",
    header: "Address",
    size: 400,
    minSize: 150,
  },
  {
    accessorKey: "google_maps_url",
    header: "Google Maps URL",
    cell: (info) => {
      const raw = info.getValue() as string;

      return (
        raw && (
          <Link href={raw} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
            {raw.replace(/https:\/\/maps.app.goo.gl\//, "")}
          </Link>
        )
      );
    },
  },
  {
    accessorKey: "google_maps_place_id",
    header: "Google Maps Place ID",
    cell: (info) => <p className="font-mono">{info.getValue()}</p>,
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
    cell: (info) => {
      const raw = info.getValue() as string;

      return (
        raw && (
          <Link href={raw} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
            {raw}
          </Link>
        )
      );
    },
    minSize: 150,
  },
  {
    accessorKey: "opening_hours",
    header: "Opening Hours",
  },
  {
    accessorKey: "properties",
    header: "Properties",
    cell: (info) => {
      const raw = JSON.stringify(info.getValue(), null, 2);
      const __html = hljs.highlight(raw, { language: "json" }).value;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"secondary"} size={"sm"}>
              <LucideCurlyBraces />
              Show
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
        <DropdownMenuContent>
          <PlaceDialog action={"update"} place={row.original} />
          <PlaceDialog action={"duplicate"} place={row.original} />
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
