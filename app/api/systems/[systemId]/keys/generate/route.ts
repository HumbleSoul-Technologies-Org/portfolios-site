import { NextResponse } from "next/server";
import { generateSystemKeys } from "@/lib/data/system-store";

export async function POST(
  request: Request,
  { params }: { params: { systemId: string } },
) {
  const newKeys = (await request.json()) as Array<unknown>;
  const updatedKeys = generateSystemKeys(params.systemId, newKeys as any[]);

  if (!updatedKeys) {
    return NextResponse.json({ error: "System not found" }, { status: 404 });
  }

  return NextResponse.json({ keys: updatedKeys });
}
