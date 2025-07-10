"use client";

import { TaskQueueStatus } from "@/app/api/admin/task-queue/status/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ALL_TASK_STATUSES } from "@/lib/constants";
import { TaskStatus } from "@/types/types";
import { ListChecksIcon } from "lucide-react";
import { use } from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

interface TaskQueueStatusCardProps {
  status: Promise<TaskQueueStatus>;
}

// Override ChartConfig to use TaskStatus keys
type TaskQueueChartConfig = ChartConfig & {
  [K in TaskStatus]: ChartConfig[string];
};

const chartConfig = {
  PENDING: { label: "Pending", color: "var(--color-pending)" },
  STARTED: { label: "Started", color: "var(--color-started)" },
  SUCCESS: { label: "Success", color: "var(--color-success)" },
  FAILURE: { label: "Failure", color: "var(--color-failure)" },
} satisfies TaskQueueChartConfig;

export const TaskQueueStatusCard = ({ status }: TaskQueueStatusCardProps) => {
  const data = use(status);
  const chartData = [
    Object.fromEntries(ALL_TASK_STATUSES.map((s) => [s, data[s] ?? 0])),
  ];

  const totalTasks = Object.values(data).reduce((acc, curr) => acc + curr, 0);

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium">
          <ListChecksIcon className="size-4" />
          Task Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-xs"
        >
          <RadialBarChart data={chartData} innerRadius={80} outerRadius={100}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  active={false}
                  payload={[]}
                  coordinate={{ x: 0, y: 0 }}
                  accessibilityLayer
                />
              }
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan className="fill-foreground text-2xl font-semibold">
                          {totalTasks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          dy="24"
                          className="fill-muted-foreground text-sm"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            {Object.entries(chartConfig).map(([key, config]) => (
              <RadialBar
                key={key}
                dataKey={key}
                stackId="stack-id"
                cornerRadius={4}
                fill={config.color}
                className="[&>path]:transition-colors"
                stroke="var(--color-background)"
                strokeWidth={4}
                minPointSize={8}
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
        <div className="flex flex-col gap-2">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div className="flex items-center justify-between gap-2" key={key}>
              <span className="text-muted-foreground text-sm">
                {config.label}
              </span>
              <span
                className="text-muted-foreground min-w-8 text-right text-sm"
                style={{ color: config.color }}
              >
                {chartData[0][key]?.toLocaleString() ?? 0}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
