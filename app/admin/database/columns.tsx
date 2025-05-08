"use client";

import { DeletePlaceDialog } from "@/app/admin/database/dialogs/delete-place-dialog";
import { PlaceDialog } from "@/app/admin/database/dialogs/place-dialog";
import { DataTableColumnHeader } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDate,
  RelativeTimeZoneDisplay,
  RelativeTimeZoneLabel,
} from "@/components/ui/kibo-ui/relative-time";
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

const timezones = [
  { label: "UTC", zone: "UTC" },
  { label: "PDT", zone: "America/Los_Angeles" },
  // {
  //   label: "EDT",
  //   zone: "America/New_York",
  // },
];

export const columns: ColumnDef<API.Place, never>[] = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
    ),
    size: 36,
    enableHiding: false,
    enableSorting: false,
    enableResizing: false,
    meta: {
      sticky: "left",
    },
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
    enableHiding: false,
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
  columnHelper.accessor((row) => row.address, {
    id: "Address",
    header: "Address",
    size: 400,
    minSize: 150,
  }),
  columnHelper.accessor((row) => row.google_maps_url, {
    id: "Google Maps URL",
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
    minSize: 150,
  }),
  columnHelper.accessor((row) => row.google_maps_place_id, {
    id: "Google Maps Place ID",
    header: "Google Maps Place ID",
    cell: (info) => <p className="font-mono">{info.getValue()}</p>,
    enableSorting: false,
    enableResizing: false,
  }),
  columnHelper.accessor((row) => row.phone_number, {
    id: "Phone Number",
    header: "Phone Number",
    minSize: 150,
  }),
  columnHelper.accessor((row) => row.website_url, {
    id: "Website URL",
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
  }),
  columnHelper.accessor((row) => row.opening_hours, {
    id: "Opening Hours",
    header: "Opening Hours",
    minSize: 150,
  }),
  columnHelper.accessor((row) => row.properties, {
    id: "Properties",
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
    enableSorting: false,
    enableResizing: false,
  }),
  columnHelper.accessor((row) => row.tags, {
    id: "Tags",
    header: "Tags",
    minSize: 150,
  }),
  columnHelper.accessor((row) => row.created_at, {
    id: "Created At",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: (info) => (
      <RelativeTime time={new Date(info.getValue())} dateFormatOptions={{ dateStyle: "medium" }}>
        {timezones.map(({ zone, label }) => (
          <RelativeTimeZone key={zone} zone={zone}>
            <RelativeTimeZoneLabel>{label}</RelativeTimeZoneLabel>
            <RelativeTimeZoneDate />
            <RelativeTimeZoneDisplay className="pl-0" />
          </RelativeTimeZone>
        ))}
      </RelativeTime>
    ),
    size: 230,
    enableResizing: false,
  }),
  columnHelper.accessor((row) => row.updated_at, {
    id: "Updated At",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: (info) => (
      <RelativeTime time={new Date(info.getValue())} dateFormatOptions={{ dateStyle: "medium" }}>
        {timezones.map(({ zone, label }) => (
          <RelativeTimeZone key={zone} zone={zone}>
            <RelativeTimeZoneLabel>{label}</RelativeTimeZoneLabel>
            <RelativeTimeZoneDate />
            <RelativeTimeZoneDisplay className="pl-0" />
          </RelativeTimeZone>
        ))}
      </RelativeTime>
    ),
    size: 230,
    enableResizing: false,
  }),
  columnHelper.display({
    id: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <LucideEllipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"end"} className="w-fit">
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
    meta: {
      sticky: "right",
    },
  }),
];
