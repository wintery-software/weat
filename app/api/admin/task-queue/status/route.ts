import { createClient } from "@/lib/supabase/server";
import { TaskStatus } from "@/types/types";
import { NextResponse } from "next/server";

export type TaskQueueStatus = Record<TaskStatus, number>;

export const GET = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_task_queue_status");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as TaskQueueStatus);
};
