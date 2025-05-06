"use client";

import { PlaceTable } from "@/app/admin/database/tables/place-table";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LucideDatabase } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const TABLES = [
  {
    value: "places",
    label: "Places",
    table: PlaceTable,
  },
  {
    value: "tags",
    label: "Tags",
    table: null,
  },
  {
    value: "tag-types",
    label: "Tag Types",
    table: null,
  },
];

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [table, setTable] = useState(searchParams.get("table") || TABLES[0].value);
  const selected = TABLES.find((t) => t.value === table);

  const { status } = useSession();

  if (status === "loading") {
    return <FullscreenLoader label="Authenticating..." />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Database</h1>
      <Select
        value={table}
        onValueChange={(value) => {
          setTable(value);
          const params = new URLSearchParams(searchParams.toString());
          params.set("table", value);
          router.replace(`?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Table">
            <div className="flex items-center gap-2">
              <LucideDatabase className="size-3.5 text-muted-foreground" />
              {selected?.label ?? "Select a table"}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {TABLES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected?.table ? (
        <selected.table />
      ) : (
        <p className="text-sm text-muted-foreground">Under construction. Please check back later.</p>
      )}
      <div></div>
    </div>
  );
};

export default Page;
