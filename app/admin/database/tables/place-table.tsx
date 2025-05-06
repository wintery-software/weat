import { columns } from "@/app/admin/database/columns";
import { DataTable } from "@/components/data-table";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getPlacesAdmin } from "@/lib/api/admin/places";
import type { API } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const PlaceTable = () => {
  const { data: session, status } = useSession();

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const query = useQuery<API.Paginated<API.Place>>({
    queryKey: ["places", paginationState.pageIndex, paginationState.pageSize],
    queryFn: async () =>
      await getPlacesAdmin(
        {
          page: paginationState.pageIndex + 1,
          pageSize: paginationState.pageSize,
        },
        session!.accessToken!,
      ),
    enabled: status === "authenticated",
  });

  return query.isLoading ? (
    <FullscreenLoader>
      <p className="font-mono text-xs text-muted-foreground">
        page={paginationState.pageIndex + 1}, page_size={paginationState.pageSize}
      </p>
    </FullscreenLoader>
  ) : (
    <DataTable
      columns={columns}
      data={query.data!}
      pagination={paginationState}
      onPaginationChange={setPaginationState}
    />
  );
};
