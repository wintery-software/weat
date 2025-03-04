import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const GET = async () => {
  const notifications: WeatNotification[] = [
    {
      id: randomUUID(),
      type: "info",
      title: "Info",
      description: "Test Place, 123 Example St., Santa Clara, CA, 00000",
      createdAt: "2025-03-01T12:34:56.000Z",
    },
    {
      id: randomUUID(),
      type: "success",
      title: "Success",
      description: "Test Place, 123 Example St., Santa Clara, CA, 00000",
      createdAt: "2025-03-01T12:34:56.000Z",
    },
    {
      id: randomUUID(),
      type: "warning",
      title: "Warning",
      description: "Test Place, 123 Example St., Santa Clara, CA, 00000",
      createdAt: "2025-03-01T12:34:56.000Z",
    },
    {
      id: randomUUID(),
      type: "error",
      title: "Error",
      description: "Test Place, 123 Example St., Santa Clara, CA, 00000",
      createdAt: "2025-03-01T12:34:56.000Z",
    },
  ];

  return NextResponse.json(notifications);
};
