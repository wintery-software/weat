import { GET } from "@/app/api/restaurants/route";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock constants
vi.mock("@/lib/constants", () => ({
  RESTAURANT_SORT_OPTIONS: [
    "distance:asc",
    "distance:desc",
    "rating:asc",
    "rating:desc",
    "review_count:asc",
    "review_count:desc",
  ],
  DEFAULT_FETCH_LIMIT: 20,
}));

// Mock navigation utils
vi.mock("@/lib/navigation", () => ({
  getHaversineDistance: vi.fn((lat1, lng1, lat2, lng2) => {
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)) * 111;
  }),
}));

// Mock Supabase client - simplified approach that avoids query chain issues
const mockData = [
  {
    id: "1",
    name_zh: "测试餐厅",
    name_en: "Test Restaurant",
    location: { lat: 40.7128, lng: -74.006 },
    phone_number: "+1234567890",
    google_maps_place_id: "test_place_id",
    updated_at: "2023-12-01T10:00:00Z",
    address: {
      id: "addr1",
      street: "123 Test St",
      city: "Test City",
      province: "Test Province",
      postal_code: "12345",
    },
    summary: {
      average_rating: 4.5,
      review_count: 100,
      top_tags: ["Chinese", "Authentic"],
    },
  },
  {
    id: "2",
    name_zh: "第二餐厅",
    name_en: "Second Restaurant",
    location: { lat: 40.7589, lng: -73.9851 },
    phone_number: "+1234567891",
    google_maps_place_id: "test_place_id_2",
    updated_at: "2023-12-01T11:00:00Z",
    address: {
      id: "addr2",
      street: "456 Test Ave",
      city: "Test City",
      province: "Test Province",
      postal_code: "12346",
    },
    summary: {
      average_rating: 4.2,
      review_count: 85,
      top_tags: ["Italian", "Pizza"],
    },
  },
];

let mockSupabaseResponse: any = {
  data: mockData,
  error: null,
  count: 2,
};

// Create mock that bypasses the query builder complexity
const createMockQueryBuilder = () => ({
  or: vi.fn().mockReturnThis(),
  range: vi.fn().mockResolvedValue(mockSupabaseResponse),
});

const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock("@/lib/supabase/clients/ssr", () => ({
  createSSRClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

describe("GET /api/restaurants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseResponse = {
      data: mockData,
      error: null,
      count: 2,
    };

    // Set up the mock to return different responses for different patterns
    const mockQueryBuilder = createMockQueryBuilder();
    mockSelect.mockReturnValue(mockQueryBuilder);
    mockSelect.mockResolvedValue(mockSupabaseResponse);
    mockQueryBuilder.or.mockResolvedValue(mockSupabaseResponse);
    mockQueryBuilder.range.mockResolvedValue(mockSupabaseResponse);
  });

  describe("basic functionality", () => {
    it("returns restaurants with default pagination", async () => {
      const request = new NextRequest("http://localhost:3000/api/restaurants");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.count).toBe(2);
      expect(data.page).toBe(1);
      expect(data.pageSize).toBe(20);
      expect(data.totalPages).toBe(1);
    });

    it("handles supabase error", async () => {
      mockSupabaseResponse = {
        data: null,
        error: { message: "Database error" },
        count: 0,
      };
      mockSelect.mockResolvedValue(mockSupabaseResponse);

      const request = new NextRequest("http://localhost:3000/api/restaurants");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Database error");
    });
  });

  describe("pagination", () => {
    it("handles page parameter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?page=2",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.page).toBe(2);
    });

    it("handles limit parameter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?limit=5",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pageSize).toBe(5);
    });

    it("defaults page to 1 when invalid", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?page=invalid",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.page).toBe(1);
    });

    it("defaults limit to 20 when invalid", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?limit=invalid",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pageSize).toBe(20);
    });
  });

  describe("location and distance", () => {
    it("adds distance when lat/lng provided", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?lat=40.7128&lng=-74.0060",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data[0]).toHaveProperty("distance");
      expect(typeof data.data[0].distance).toBe("number");
    });

    it("filters by distance when provided", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?lat=40.7128&lng=-74.0060&distance=100",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.every((r: any) => typeof r.distance === "number")).toBe(
        true,
      );
    });

    it("handles distance without location", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?distance=5",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      if (data.data.length > 0) {
        expect(data.data[0]).not.toHaveProperty("distance");
      }
    });
  });

  describe("sorting", () => {
    it("sorts by distance ascending", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?lat=40.7128&lng=-74.0060&sort_by=distance:asc",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data[0].distance).toBeLessThanOrEqual(data.data[1].distance);
    });

    it("sorts by rating descending", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?sort_by=rating:desc",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data[0].summary.average_rating).toBeGreaterThanOrEqual(
        data.data[1].summary.average_rating,
      );
    });

    it("sorts by review count ascending", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?sort_by=review_count:asc",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data[0].summary.review_count).toBeLessThanOrEqual(
        data.data[1].summary.review_count,
      );
    });

    it("ignores invalid sort option", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?sort_by=invalid",
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it("handles distance sort without location", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?sort_by=distance:asc",
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
    });
  });

  describe("data structure", () => {
    it("unwraps array address to object", async () => {
      mockSupabaseResponse = {
        data: [
          {
            ...mockData[0],
            address: [mockData[0].address],
          },
        ],
        error: null,
        count: 1,
      };
      mockSelect.mockResolvedValue(mockSupabaseResponse);

      const request = new NextRequest("http://localhost:3000/api/restaurants");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.data[0].address)).toBe(false);
      expect(data.data[0].address.id).toBe("addr1");
    });

    it("unwraps array summary to object", async () => {
      mockSupabaseResponse = {
        data: [
          {
            ...mockData[0],
            summary: [mockData[0].summary],
          },
        ],
        error: null,
        count: 1,
      };
      mockSelect.mockResolvedValue(mockSupabaseResponse);

      const request = new NextRequest("http://localhost:3000/api/restaurants");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.data[0].summary)).toBe(false);
      expect(data.data[0].summary.average_rating).toBe(4.5);
    });

    it("handles missing summary data", async () => {
      mockSupabaseResponse = {
        data: [
          {
            ...mockData[0],
            summary: null,
          },
        ],
        error: null,
        count: 1,
      };
      mockSelect.mockResolvedValue(mockSupabaseResponse);

      const request = new NextRequest("http://localhost:3000/api/restaurants");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data[0].summary).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("handles empty data response", async () => {
      mockSupabaseResponse = {
        data: [],
        error: null,
        count: 0,
      };
      mockSelect.mockResolvedValue(mockSupabaseResponse);

      const request = new NextRequest("http://localhost:3000/api/restaurants");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(0);
      expect(data.count).toBe(0);
      expect(data.totalPages).toBe(1);
    });

    it("handles null data response", async () => {
      mockSupabaseResponse = {
        data: null,
        error: null,
        count: 0,
      };
      mockSelect.mockResolvedValue(mockSupabaseResponse);

      const request = new NextRequest("http://localhost:3000/api/restaurants");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(0);
    });

    it("calculates total pages correctly", async () => {
      mockSupabaseResponse = {
        data: Array(25).fill(mockData[0]),
        error: null,
        count: 25,
      };
      mockSelect.mockResolvedValue(mockSupabaseResponse);

      const request = new NextRequest(
        "http://localhost:3000/api/restaurants?limit=10",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.totalPages).toBe(3);
    });

    it("handles zero count", async () => {
      mockSupabaseResponse = {
        data: [],
        error: null,
        count: null,
      };
      mockSelect.mockResolvedValue(mockSupabaseResponse);

      const request = new NextRequest("http://localhost:3000/api/restaurants");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.totalPages).toBe(1);
    });
  });
});
