"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ALL_TASK_STATUSES } from "@/lib/constants";
import { TaskQueueStatus, TaskStatus } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon, ListChecksIcon } from "lucide-react";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { Cell, Label, Pie, PieChart } from "recharts";
import { z } from "zod";

interface TaskQueueStatusCardProps {
  status: Promise<TaskQueueStatus>;
}

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

const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export const TaskQueueStatusCard = ({ status }: TaskQueueStatusCardProps) => {
  const data = use(status);
  const totalTasks = Object.values(data).reduce((acc, curr) => acc + curr, 0);

  // Transform data for pie chart
  const chartData = ALL_TASK_STATUSES.map((status) => ({
    name: status,
    value: data[status] ?? 0,
    label: chartConfig[status].label,
    color: chartConfig[status].color,
  })).filter((item) => item.value > 0); // Only show segments with data

  const now = new Date();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
      endDate: now,
    },
  });

  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium">
          <ListChecksIcon className="size-4" />
          Task Queue Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Form {...form}>
          <form
            id="task-queue-query-actions"
            className="flex flex-wrap items-center gap-2"
            onSubmit={form.handleSubmit((data) => {
              console.log("Form submitted:", data);
              // Handle form submission here
            })}
          >
            <Button
              variant="outline"
              className="font-normal"
              type="button"
              onClick={() => {
                form.setValue(
                  "startDate",
                  new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                );
              }}
            >
              1d
            </Button>
            <Button
              variant="outline"
              className="font-normal"
              type="button"
              onClick={() => {
                form.setValue(
                  "startDate",
                  new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
                );
              }}
            >
              3d
            </Button>
            <Button
              variant="outline"
              className="font-normal"
              type="button"
              onClick={() => {
                form.setValue(
                  "startDate",
                  new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                );
              }}
            >
              7d
            </Button>
            <div
              id="task-queue-query-datetime-picker"
              className="flex items-center gap-2"
            >
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            id="task-queue-query-start-date"
                            className="w-32 justify-between font-normal"
                          >
                            {field.value
                              ? field.value.toLocaleDateString()
                              : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) {
                              return;
                            }

                            field.onChange(date);
                            setCalendarOpen(false);
                          }}
                          required
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Input
                        type="time"
                        className="bg-background w-24 appearance-none text-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        value={
                          field.value ? format(field.value, "HH:mm:ss") : ""
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (!field.value) {
                            return;
                          }

                          const date = new Date(field.value);
                          date.setHours(parseInt(e.target.value.split(":")[0]));
                          date.setMinutes(
                            parseInt(e.target.value.split(":")[1]),
                          );
                          date.setSeconds(
                            parseInt(e.target.value.split(":")[2]),
                          );
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Query</Button>
          </form>
        </Form>
        <div id="task-queue-query-time-range" className="flex flex-col">
          <p className="item flex gap-1 text-xs">
            <span className="text-muted-foreground w-8">Start:</span>
            <span className="font-mono">
              {form.watch("startDate")
                ? format(form.watch("startDate"), "yyyy-MM-dd HH:mm:ss")
                : "Not set"}
            </span>
          </p>
          <p className="flex gap-1 text-xs">
            <span className="text-muted-foreground w-8">End:</span>
            <span className="font-mono">
              {form.watch("endDate")
                ? format(form.watch("endDate"), "yyyy-MM-dd HH:mm:ss")
                : "Not set"}
            </span>
          </p>
        </div>
        <div className="flex flex-1 items-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-64 w-full"
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
          <div className="flex flex-col gap-2">
            {Object.entries(chartConfig).map(([key, config]) => (
              <div
                className="flex items-center justify-between gap-2"
                key={key}
              >
                <span className="text-muted-foreground text-sm">
                  {config.label}
                </span>
                <span
                  className="text-muted-foreground min-w-8 text-right text-sm"
                  style={{ color: config.color }}
                >
                  {data[key as TaskStatus]?.toLocaleString() ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
