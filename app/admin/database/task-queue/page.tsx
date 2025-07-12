import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatabaseIcon } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="table-editor" className="text-muted-foreground">
          Supabase
        </Label>
        <Button id="table-editor" size="sm" className="gap-2" asChild>
          <Link
            href="https://supabase.com/dashboard/project/gaiayaqlgokpuinnmwyr/editor/19732?schema=public"
            target="_blank"
            rel="noopener noreferrer"
            title="View task_queue table on Supabase"
          >
            <DatabaseIcon />
            <span>Table Editor (Supabase)</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
