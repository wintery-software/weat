import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createSSRClient();
  const { data, error } = await supabase.from("tags").select("*");

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
