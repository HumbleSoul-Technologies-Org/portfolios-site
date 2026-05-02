import { NextResponse } from "next/server";
import { createSystem, getAllSystems } from "@/lib/data/system-store";

export async function GET() {
  return NextResponse.json(getAllSystems());
}

export async function POST(request: Request) {
  const payload = await request.json();
  const savedSystem = createSystem(payload);
  return NextResponse.json({ savedSystem });
}
