import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { SuccessWithoutErrorFromRoute } from "@/types/api";
import { TaskQueueStatus } from "@/types/types";
import { isValid, parseISO } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start_date");

  if (!start) {
    const message = "start_date is required";
    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }

  const startDate = parseISO(start);

  if (!isValid(startDate)) {
    const message =
      "start_date must be a valid ISO 8601 string (e.g., YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)";
    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createSSRClient();
  const { data, error } = await supabase.rpc("get_task_queue_status", {
    start_date: startDate.toISOString(),
    end_date: new Date().toISOString(), // Default to now
  });

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as TaskQueueStatus);
};

export type TaskQueueStatusGetResponse = SuccessWithoutErrorFromRoute<
  typeof GET
>;
