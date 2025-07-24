import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { type SuccessWithoutErrorFromRoute } from "@/types/api";
import { type TaskQueueStatus } from "@/types/types";
import { isValid, parseISO } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start_date");

  if (!start) {
    const message = "start_date is required";
    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }

  const startDate = parseISO(start);
  const endDate = new Date();

  if (!isValid(startDate)) {
    const message = `start_date must be a valid ISO 8601 string, got: ${start}`;
    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createSSRClient();
  const { data, error } = await supabase.rpc("get_tasks_status", {
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  });

  if (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(
    `Tasks status (${startDate.toISOString()} - ${endDate.toISOString()})`,
    data,
  );

  return NextResponse.json(data as TaskQueueStatus);
};

export type TaskQueueStatusGetResponse = SuccessWithoutErrorFromRoute<
  typeof GET
>;
