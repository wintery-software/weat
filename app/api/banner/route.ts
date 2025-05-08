import { NextResponse } from "next/server";

export const GET = async () => {
  const type = process.env.NEXT_PUBLIC_BANNER_TYPE || null;
  const message = process.env.NEXT_PUBLIC_BANNER_MESSAGE || null;
  const url = process.env.NEXT_PUBLIC_BANNER_URL || null;

  return NextResponse.json({ message, type, url });
};
