import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { TaskQueueStatus } from "@/types/types";

export const getTaskQueueStatus = async () => {
  const supabase = await createSSRClient();
  const { data, error } = await supabase.rpc("get_task_queue_status");

  if (error) {
    throw error;
  }

  return data as TaskQueueStatus;
};
