import { TaskQueueStatus } from "@/app/api/admin/task-queue/status/route";
import { api } from "@/lib/api";

export const getTaskQueueStatus = async () => {
  const response = await api.get<TaskQueueStatus>("/admin/task-queue/status");

  return response.data;
};
