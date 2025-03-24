"use client";

import { DataTable } from "@/components/data-table";
import TitleLayout from "@/components/layouts/title-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/table-core";
import Link from "next/link";

/**
 * Render URL string as a link.
 *
 * @param value URL string
 * @param external Open in new tab
 * @param showPathname Show only pathname
 * @return HTML `<a>` element if URL is valid, otherwise plain text
 */
const renderUrl = (value: string, external: boolean = false, showPathname: boolean = false) => {
  try {
    // Validate URL
    const url = new URL(value);

    return (
      <Link href={url.href} target={external ? "_blank" : "_self"} className="link">
        {showPathname ? url.pathname : url.href}
      </Link>
    );
  } catch {
    return value;
  }
};

const columns: ColumnDef<Weat.Place>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const value = row.getValue("id") as string;
      return <div className="whitespace-nowrap font-mono text-green-700 dark:text-green-500">{value}</div>;
    },
  },
  {
    accessorKey: "placeId",
    header: () => <div className="whitespace-nowrap">Place ID</div>,
    cell: ({ row }) => {
      const value = row.getValue("placeId") as string;
      return <div className="whitespace-nowrap font-mono">{value}</div>;
    },
  },
  {
    accessorKey: "names",
    header: "Names",
    cell: ({ row }) => {
      const names = row.getValue("names") as Weat.Place["names"];

      return (
        <div className="flex flex-col gap-1">
          {names.map((name) => (
            <div key={name.languageCode} className="flex gap-1">
              <Badge variant={"outline"}>{name.languageCode}</Badge>
              <span className="whitespace-nowrap">{name.text}</span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "types",
    header: "Types",
    cell: ({ row }) => {
      const value = row.getValue("types") as Weat.Place["types"];

      return (
        <div className="flex flex-col gap-1">
          {value.map((type) => (
            <div key={type}>
              <Badge variant={"outline"}>{type}</Badge>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const value = row.getValue("address") as string;
      return <div className="whitespace-nowrap">{value}</div>;
    },
  },
  {
    accessorKey: "googleMapsUrl",
    header: () => <div className="whitespace-nowrap">Google Maps URL</div>,
    cell: ({ row }) => {
      const value = row.getValue("googleMapsUrl") as string;
      return renderUrl(value, true, true);
    },
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => {
      const position = row.getValue("position") as google.maps.LatLngLiteral;

      return (
        <div>
          {position.lat},&nbsp;{position.lng}
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="whitespace-nowrap">Phone Number</div>,
  },
  {
    accessorKey: "websiteUrl",
    header: () => <div className="whitespace-nowrap">Website URL</div>,
    cell: ({ row }) => {
      const value = row.getValue("websiteUrl") as string;
      return renderUrl(value, true, false);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return <div className="whitespace-nowrap">{value}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const value = row.getValue("updatedAt") as string;
      return <div className="whitespace-nowrap">{value}</div>;
    },
  },
];

const Page = () => {
  const { data } = useQuery<Weat.Place[]>({
    queryKey: ["places"],
    queryFn: async () => (await api.get(ENDPOINTS.places)).data,
  });
  const { data: dataSource } = useQuery<{ source: string }>({
    queryKey: ["placesSource"],
    queryFn: async () => (await api.get(ENDPOINTS.placesSource)).data,
  });

  return (
    <TitleLayout title="Places">
      <div className="flex flex-col gap-4">
        <Button disabled={dataSource?.source.toLowerCase() !== "dynamo"}>Add Place</Button>
        <div className="text-xs font-medium uppercase text-muted-foreground">
          Data Source: {dataSource?.source} ({data?.length} items)
        </div>
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </TitleLayout>
  );
};

export default Page;
