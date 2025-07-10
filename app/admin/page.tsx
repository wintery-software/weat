import { TaskQueueCard } from "@/app/admin/task-queue-card";
import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseIcon, UsersIcon } from "lucide-react";

const Page = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-medium">Welcome back, Admin!</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-medium">
              <DatabaseIcon className="size-4" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {Number(100).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="gap-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-medium">
              <UsersIcon className="size-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {Number(56).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="gap-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-medium">
              <DatabaseIcon className="size-4" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {Number(100).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SuspenseWrapper>
          <TaskQueueCard />
        </SuspenseWrapper>
      </div>
    </div>
  );
};

export default Page;
