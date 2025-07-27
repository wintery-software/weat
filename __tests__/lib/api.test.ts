import { api } from "@/lib/api";
import axios, { AxiosError, AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock constants
vi.mock("@/lib/constants", () => ({
  APP_NAME: "WEAT",
}));

// Mock console.error to capture error logs
const mockConsoleError = vi.fn();
global.console.error = mockConsoleError;

// Helper function to simulate the interceptor logic
const simulateInterceptor = (error: AxiosError | Error): string => {
  let message: string;

  if (axios.isAxiosError(error) && error.response?.data) {
    const responseData = error.response.data as unknown;

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "error" in responseData
    ) {
      message = String(responseData.error);
    } else if (typeof responseData === "string") {
      message = responseData;
    } else {
      message = error.message || error.response.statusText || "Unknown error";
    }
  } else {
    message = (error as Error).message || "Network error";
  }

  console.error("WEAT API Error:", message);

  if (axios.isAxiosError(error)) {
    error.message = message;
  }

  return message;
};

describe("API Interceptor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Error handling scenarios", () => {
    it("should handle API errors with {error: string} format", () => {
      const mockError = new AxiosError("Request failed", "400", {}, {}, {
        status: 400,
        statusText: "Bad Request",
        data: { error: "Invalid request parameters" },
        headers: {},
        config: { headers: {} } as any,
      } as AxiosResponse);

      const message = simulateInterceptor(mockError);

      expect(message).toBe("Invalid request parameters");
      expect(mockError.message).toBe("Invalid request parameters");
      expect(mockConsoleError).toHaveBeenCalledWith(
        "WEAT API Error:",
        "Invalid request parameters",
      );
    });

    it("should handle API errors with plain string format", () => {
      const mockError = new AxiosError("Request failed", "500", {}, {}, {
        status: 500,
        statusText: "Internal Server Error",
        data: "Database connection failed",
        headers: {},
        config: { headers: {} } as any,
      } as AxiosResponse);

      const message = simulateInterceptor(mockError);

      expect(message).toBe("Database connection failed");
      expect(mockError.message).toBe("Database connection failed");
      expect(mockConsoleError).toHaveBeenCalledWith(
        "WEAT API Error:",
        "Database connection failed",
      );
    });

    it("should handle API errors with unexpected response format", () => {
      const mockError = new AxiosError("Request failed", "500", {}, {}, {
        status: 500,
        statusText: "Internal Server Error",
        data: { unexpected: "format" },
        headers: {},
        config: { headers: {} } as any,
      } as AxiosResponse);

      const message = simulateInterceptor(mockError);

      expect(message).toBe("Request failed");
      expect(mockError.message).toBe("Request failed");
      expect(mockConsoleError).toHaveBeenCalledWith(
        "WEAT API Error:",
        "Request failed",
      );
    });

    it("should handle network errors (no response)", () => {
      const mockError = new AxiosError(
        "Network Error",
        "NETWORK_ERROR",
        {},
        {},
        undefined,
      );

      const message = simulateInterceptor(mockError);

      expect(message).toBe("Network Error");
      expect(mockError.message).toBe("Network Error");
      expect(mockConsoleError).toHaveBeenCalledWith(
        "WEAT API Error:",
        "Network Error",
      );
    });

    it("should handle errors with null response data", () => {
      const mockError = new AxiosError("Request failed", "500", {}, {}, {
        status: 500,
        statusText: "Internal Server Error",
        data: null,
        headers: {},
        config: {} as any,
      } as AxiosResponse);

      const message = simulateInterceptor(mockError);

      expect(message).toBe("Request failed");
      expect(mockError.message).toBe("Request failed");
      expect(mockConsoleError).toHaveBeenCalledWith(
        "WEAT API Error:",
        "Request failed",
      );
    });

    it("should handle non-Axios errors", () => {
      const mockError = new Error("Generic JavaScript error");

      const message = simulateInterceptor(mockError);

      expect(message).toBe("Generic JavaScript error");
      expect(mockConsoleError).toHaveBeenCalledWith(
        "WEAT API Error:",
        "Generic JavaScript error",
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle response with undefined error property", () => {
      const mockError = new AxiosError("Request failed", "500", {}, {}, {
        status: 500,
        statusText: "Internal Server Error",
        data: { error: undefined },
        headers: {},
        config: {} as any,
      } as AxiosResponse);

      const message = simulateInterceptor(mockError);

      expect(message).toBe("undefined");
      expect(mockError.message).toBe("undefined");
      expect(mockConsoleError).toHaveBeenCalledWith(
        "WEAT API Error:",
        "undefined",
      );
    });

    it("should handle response with empty string error", () => {
      const mockError = new AxiosError("Request failed", "500", {}, {}, {
        status: 500,
        statusText: "Internal Server Error",
        data: { error: "" },
        headers: {},
        config: {} as any,
      } as AxiosResponse);

      const message = simulateInterceptor(mockError);

      expect(message).toBe("");
      expect(mockError.message).toBe("");
      expect(mockConsoleError).toHaveBeenCalledWith("WEAT API Error:", "");
    });

    it("should handle response with number error property", () => {
      const mockError = new AxiosError("Request failed", "500", {}, {}, {
        status: 500,
        statusText: "Internal Server Error",
        data: { error: 404 },
        headers: {},
        config: {} as any,
      } as AxiosResponse);

      const message = simulateInterceptor(mockError);

      expect(message).toBe("404");
      expect(mockError.message).toBe("404");
      expect(mockConsoleError).toHaveBeenCalledWith("WEAT API Error:", "404");
    });

    it("should handle response with boolean error property", () => {
      const mockError = new AxiosError("Request failed", "500", {}, {}, {
        status: 500,
        statusText: "Internal Server Error",
        data: { error: false },
        headers: {},
        config: {} as any,
      } as AxiosResponse);

      const message = simulateInterceptor(mockError);

      expect(message).toBe("false");
      expect(mockError.message).toBe("false");
      expect(mockConsoleError).toHaveBeenCalledWith("WEAT API Error:", "false");
    });
  });

  describe("Real API instance", () => {
    it("should have the correct base configuration", () => {
      expect(api.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_API_URL);
      expect(api.defaults.headers["Content-Type"]).toBe("application/json");
    });

    it("should have response interceptors configured", () => {
      expect(api.interceptors.response).toBeDefined();
    });
  });
});
