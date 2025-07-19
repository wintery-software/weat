import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { type SuccessWithoutErrorFromRoute } from "@/types/api";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createSSRClient();
  const { count, error } = await supabase
    .from("tags")
    .select("*", { count: "exact" });

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: count as number });
};

export type TagsCountGetResponse = SuccessWithoutErrorFromRoute<typeof GET>;
