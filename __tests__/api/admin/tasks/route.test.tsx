import { GET } from "@/app/api/admin/tasks/status/route";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Supabase client
vi.mock("@/lib/supabase/clients/ssr", () => ({
  createSSRClient: vi.fn(() => ({
    rpc: vi.fn(() =>
      Promise.resolve({ data: { status: "idle" }, error: null }),
    ),
  })),
}));

describe("GET /api/admin/tasks/status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ISO 8601 time string validation", () => {
    it("should return 400 when start_date is missing", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("start_date is required");
    });

    it("should return 400 for 'invalid-date'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=invalid-date",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: invalid-date",
      );
    });

    it("should return 400 for 'not-a-date'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=not-a-date",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: not-a-date",
      );
    });

    it("should accept date with space separator '2023-12-01 10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01%2010:00:00Z",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should accept date without timezone '2023-12-01T10:00:00'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01T10:00:00",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should accept date only '2023-12-01'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should return 400 for time only '10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=10:00:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 10:00:00Z",
      );
    });

    it("should return 400 for empty string", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("start_date is required");
    });

    it("should return 400 for 'null' string", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=null",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: null",
      );
    });

    it("should return 400 for 'undefined' string", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=undefined",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: undefined",
      );
    });

    it("should return 400 for invalid month '2023-13-01T10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-13-01T10:00:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-13-01T10:00:00Z",
      );
    });

    it("should return 400 for invalid day '2023-12-32T10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-32T10:00:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-12-32T10:00:00Z",
      );
    });

    it("should return 400 for invalid hour '2023-12-01T25:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01T25:00:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-12-01T25:00:00Z",
      );
    });

    it("should return 400 for invalid minute '2023-12-01T10:60:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01T10:60:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-12-01T10:60:00Z",
      );
    });

    it("should return 400 for invalid second '2023-12-01T10:00:60Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01T10:00:60Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-12-01T10:00:60Z",
      );
    });

    it("should return 400 for invalid leap year date '2023-02-29T10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-02-29T10:00:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-02-29T10:00:00Z",
      );
    });

    it("should return 400 for invalid April date '2023-04-31T10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-04-31T10:00:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-04-31T10:00:00Z",
      );
    });

    it("should return 400 for invalid June date '2023-06-31T10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-06-31T10:00:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-06-31T10:00:00Z",
      );
    });

    it("should return 400 for invalid September date '2023-09-31T10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-09-31T10:00:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-09-31T10:00:00Z",
      );
    });

    it("should return 400 for invalid November date '2023-11-31T10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-11-31T10:00:00Z",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "start_date must be a valid ISO 8601 string, got: 2023-11-31T10:00:00Z",
      );
    });

    it("should accept valid ISO 8601 date string '2023-12-01T10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01T10:00:00Z",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should accept valid ISO 8601 date with milliseconds '2023-12-01T10:00:00.000Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01T10:00:00.000Z",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should accept valid ISO 8601 date with timezone offset '+00:00'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01T10:00:00%2B00:00",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should accept valid ISO 8601 date with negative timezone offset '-05:00'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01T10:00:00-05:00",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should accept valid leap year date '2024-02-29T10:00:00Z'", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2024-02-29T10:00:00Z",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should handle multiple query parameters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/tasks/status?start_date=2023-12-01T10:00:00Z&other_param=value",
      );

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });
  });
});
