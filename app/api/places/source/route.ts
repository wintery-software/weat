import { NextResponse } from "next/server";

export const GET = async () => NextResponse.json({ source: process.env.DATA_SOURCE });
