import { dataInfraApi } from "@/lib/api";
import { type Tag } from "@/types/types";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { tag_ids: tagIds } = (await req.json()) as { tag_ids: string[] };
    const { id: tagClusterId } = await context.params;

    if (!tagIds || tagIds.length === 0) {
      throw new Error("Missing tag IDs");
    }

    if (!tagClusterId) {
      throw new Error("Missing tag cluster ID");
    }

    const response = await dataInfraApi.post<Tag[]>(
      `/tag-clusters/${tagClusterId}/suggestions`,
      { tag_ids: tagIds },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
};
