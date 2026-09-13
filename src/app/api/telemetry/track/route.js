import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    return NextResponse.json({ success: true, count: 1 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "telemetry service active" });
}
