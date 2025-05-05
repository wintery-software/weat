import { auth } from "@/lib/next-auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const response = NextResponse.next();
  response.headers.set("x-url", request.url);

  return response;
});
