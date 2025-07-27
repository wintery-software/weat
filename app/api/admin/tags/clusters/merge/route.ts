import { dataInfraApi } from "@/lib/api";
import { type Tag } from "@/types/types";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { tag_ids: tagIds, tag_cluster_id: tagClusterId } =
      (await req.json()) as {
        tag_ids: string[];
        tag_cluster_id: string;
      };

    if (!tagIds || tagIds.length === 0) {
      throw new Error("Missing tag IDs");
    }

    if (!tagClusterId) {
      throw new Error("Missing tag cluster ID");
    }

    const response = await dataInfraApi.post<Tag[]>(`/merge/tags`, {
      tag_ids: tagIds,
      tag_cluster_id: tagClusterId,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
};
