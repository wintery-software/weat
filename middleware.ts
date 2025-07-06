import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  // Only apply CORS headers to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next();

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    return response;
  }

  return NextResponse.next();
};

export const config = {
  matcher: "/api/:path*",
};
