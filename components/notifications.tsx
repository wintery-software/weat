"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetcher } from "@/lib/utils";
import { LucideBell, LucideInbox, LucideX } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { CSSProperties } from "react";
import useSWR from "swr";

interface NotificationItemProps {
  notification: Weat.Notification;
}

const NOTIFICATION_TYPE_COLORS: Record<AlertType, string> = {
  info: "#0ea5e9", // sky-500
  success: "#16a34a", // green-600
  warning: "#facc15", // yellow-400
  error: "#dc2626", // red-600
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const createdAt = moment(notification.createdAt);

  return (
    <div
      style={
        {
          "--notification-border-color": NOTIFICATION_TYPE_COLORS[notification.type],
        } as CSSProperties
      }
      className={`flex border-l-2 border-[var(--notification-border-color)] px-2`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-col">
          <p className="font-semibold">{notification.title}</p>
          <p className="text-xs">{notification.description}</p>
        </div>
        <p className="text-xs text-muted-foreground" title={createdAt.format("LLL")}>
          {createdAt.fromNow()}
        </p>
      </div>
    </div>
  );
};

const Notifications = () => {
  const { data } = useSWR<Weat.Notification[]>("/api/notifications", fetcher);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <LucideBell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"end"} className="w-80 sm:w-96">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <Link href="/notifications">Notifications</Link>
            <Button size={"sm"} variant={"link"} className="text-link">
              Clear all
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80 sm:h-96">
          {data && data.length !== 0 ? (
            data.map((n) => (
              <DropdownMenuItem key={n.id} asChild>
                <div className="flex items-center">
                  <Link href={n.url || "#"} className="flex">
                    <NotificationItem notification={n} />
                  </Link>
                  <Button size={"icon"} variant={"ghost"} title="Mark as read">
                    <LucideX />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground/5">
                <LucideInbox />
              </div>
              No new notifications
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
