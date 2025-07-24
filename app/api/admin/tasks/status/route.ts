import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { type SuccessWithoutErrorFromRoute } from "@/types/api";
import { type TaskQueueStatus } from "@/types/types";
import { isValid, parseISO } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const startDateValue = searchParams.get("start_date");
  const endDateValue = searchParams.get("end_date");

  if (!startDateValue) {
    const message = "start_date is required";
    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!endDateValue) {
    const message = "end_date is required";
    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }

  const startDate = parseISO(startDateValue);
  const endDate = parseISO(endDateValue);

  if (!isValid(startDate)) {
    const message = `start_date ${startDateValue} is not a valid ISO 8601 string`;
    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!isValid(endDate)) {
    const message = `end_date ${endDateValue} is not a valid ISO 8601 string`;
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
