"use client";

import { columns } from "@/app/admin/database/columns";
import { DataTable } from "@/components/data-table";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { WeatAPI } from "@/lib/api";
import type { API } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/table-core";
import { useSession } from "next-auth/react";
import { useState } from "react";

const Page = () => {
  const { data: session, status } = useSession();

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const placesQuery = useQuery<API.Paginated<API.Place>>({
    queryKey: ["places", paginationState.pageIndex, paginationState.pageSize],
    queryFn: async () =>
      (
        await WeatAPI.get<API.Paginated<API.Place>>("/admin/places", {
          params: {
            // Index starts from 0 so we need to add 1
            page: paginationState.pageIndex + 1,
            page_size: paginationState.pageSize,
          },
          headers: {
            Authorization: `Bearer ${session!.accessToken}`,
          },
        })
      ).data,
    enabled: status === "authenticated",
  });

  if (status === "loading") {
    return <FullscreenLoader label="Authenticating..." />;
  }

  return (
    <div>
      <h1>Database</h1>
      <div>
        {placesQuery.isLoading ? (
          <FullscreenLoader>
            <p className="font-mono text-xs text-muted-foreground">
              page={paginationState.pageIndex + 1}, page_size={paginationState.pageSize}
            </p>
          </FullscreenLoader>
        ) : (
          <DataTable
            columns={columns}
            data={placesQuery.data!}
            pagination={paginationState}
            onPaginationChange={setPaginationState}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
