"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from "@/lib/api";
import { ALL_TASK_STATUSES } from "@/lib/constants";
import {
  type APIError,
  type TaskQueueStatus,
  type TaskStatus,
} from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse } from "axios";
import { format } from "date-fns";
import { ChevronDownIcon, ListChecksIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

// Override ChartConfig to use TaskStatus keys
type TaskQueueChartConfig = ChartConfig & {
  [K in TaskStatus]: ChartConfig[string];
};

const chartConfig = {
  PENDING: { label: "Pending", color: "var(--color-warning)" },
  STARTED: { label: "Started", color: "var(--color-info)" },
  SUCCESS: { label: "Success", color: "var(--color-success)" },
  FAILURE: { label: "Failure", color: "var(--color-error)" },
} satisfies TaskQueueChartConfig;

export const TaskQueueStatusCard = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  );
  const [quickDateRange, setQuickDateRange] = useState<number>(1);

  // Remove startDate from queryKey, and set enabled: false
  const { data, isFetching } = useQuery<
    AxiosResponse<TaskQueueStatus>,
    APIError,
    TaskQueueStatus
  >({
    queryKey: ["admin", "task-queue", "status", startDate?.toISOString()],
    queryFn: () =>
      api.get(`/admin/task-queue/status?start_date=${startDate.toISOString()}`),
    select: (res) => res.data,
    refetchOnWindowFocus: false,
    enabled: !!startDate,
  });

  const hasNoStatus = data && Object.values(data).every((value) => value === 0);

  // Transform data for pie chart
  const chartData = data
    ? ALL_TASK_STATUSES.map((s) => ({
        name: s,
        value: data[s],
        label: chartConfig[s].label,
        color: chartConfig[s].color,
      })).filter((item) => item.value > 0)
    : [];

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium">
          <ListChecksIcon className="size-4" />
          Task Queue Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            variant="outline"
            type="single"
            value={
              quickDateRange !== undefined ? String(quickDateRange) : undefined
            }
            onValueChange={(value) => {
              const days = Number(value);
              setQuickDateRange(days);
              const newStartDate = new Date();
              newStartDate.setDate(newStartDate.getDate() - days);
              setStartDate(newStartDate);
            }}
          >
            <ToggleGroupItem value="1">1d</ToggleGroupItem>
            <ToggleGroupItem value="3">3d</ToggleGroupItem>
            <ToggleGroupItem value="7">7d</ToggleGroupItem>
          </ToggleGroup>
          <div className="flex items-center gap-2">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-32 justify-between font-normal"
                >
                  {startDate ? startDate.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={startDate}
                  onSelect={(date) => {
                    if (!date) {
                      return;
                    }

                    setStartDate(date);
                    setCalendarOpen(false);
                  }}
                  required
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              className="bg-background w-24 appearance-none text-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              value={startDate ? format(startDate, "HH:mm:ss") : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!startDate) {
                  return;
                }

                const date = new Date(startDate);
                const [h, m, s] = e.target.value.split(":").map(Number);

                date.setHours(h);
                date.setMinutes(m);
                date.setSeconds(s);

                setStartDate(date);
              }}
            />
          </div>
        </div>
        <div className="flex h-64 items-center justify-center">
          {isFetching ? (
            <Loader2Icon className="size-6 animate-spin" />
          ) : hasNoStatus ? (
            <p className="text-muted-foreground">No data</p>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={(props) => (
                    <ChartTooltipContent hideLabel {...props} />
                  )}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={95}
                  outerRadius={110}
                  stroke="var(--color-background)"
                  strokeWidth={2}
                  minAngle={4}
                  cornerRadius={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        // Calculate total task count
                        const totalTasks = data
                          ? Object.values(data).reduce((sum, v) => sum + v, 0)
                          : 0;

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
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-2">
          <p className="text-muted-foreground self-center text-xs">
            {format(startDate, "yyyy-MM-dd HH:mm:ss")} -{" "}
            {format(new Date(), "yyyy-MM-dd HH:mm:ss")}
          </p>
          <div className="flex flex-col">
            {Object.entries(chartConfig).map(([key, config]) => (
              <div
                key={key}
                className="hover:bg-muted flex items-center justify-between gap-2 rounded-md px-2 py-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-1.5 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm">{config.label}</span>
                </div>
                <span className="w-full text-right text-sm font-medium">
                  {data?.[key as TaskStatus]?.toLocaleString() ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
