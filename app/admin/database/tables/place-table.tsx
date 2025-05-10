import { columns } from "@/app/admin/database/columns";
import { PlaceDialog } from "@/app/admin/database/dialogs/place-dialog";
import { DataTable } from "@/components/data-table";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getPlacesAdmin } from "@/lib/api/admin/places";
import type { API } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import type { Table } from "@tanstack/table-core";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

export const PlaceTable = () => {
  const { data: session, status } = useSession();

  const tableRef = useRef<Table<API.Place> | null>(null);

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
    <div className="flex flex-col gap-4">
      <PlaceDialog action={"create"} trigger={"button"} />
      <DataTable
        ref={tableRef}
        columns={columns}
        data={query.data!}
        pagination={paginationState}
        onPaginationChange={setPaginationState}
      />
    </div>
  );
};
