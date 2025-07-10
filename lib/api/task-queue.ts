import { TaskQueueStatus } from "@/app/api/admin/task-queue/status/route";
import { createClient } from "@/lib/supabase/server";

export const getTaskQueueStatus = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_task_queue_status");

  if (error) {
    throw error;
  }

  return data as TaskQueueStatus;
};
