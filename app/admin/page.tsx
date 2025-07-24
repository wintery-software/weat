import { RestaurantsCard } from "@/components/admin/restaurants-card";
import { TagsCard } from "@/components/admin/tags-card";
import { TasksStatusCard } from "@/components/admin/tasks-status-card";
import { Label } from "@/components/ui/label";

const Page = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-medium">Welcome back, Admin!</h2>
      <div className="flex flex-col gap-4">
        <Label htmlFor="database-overview" className="text-muted-foreground">
          Overview
        </Label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <RestaurantsCard />
          <TagsCard />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Label htmlFor="aggregated-data" className="text-muted-foreground">
          Infrastructure
        </Label>
        <div
          id="aggregated-data"
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <TasksStatusCard />
        </div>
      </div>
    </div>
  );
};

export default Page;
