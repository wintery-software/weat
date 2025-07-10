import { getTaskQueueStatus } from "@/lib/api/task-queue";
import { useSuspenseQuery } from "@tanstack/react-query";

const TASK_QUEUE_STATUS_REFETCH_INTERVAL = 10 * 1000;

export const useTaskQueueStatus = () => {
  return useSuspenseQuery({
    queryKey: ["task_queue", "status"],
    queryFn: getTaskQueueStatus,
    refetchInterval: TASK_QUEUE_STATUS_REFETCH_INTERVAL,
  });
};
