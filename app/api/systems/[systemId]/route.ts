import { NextResponse } from "next/server";
import { deleteSystem, updateSystem } from "@/lib/data/system-store";

export async function PUT(
  request: Request,
  { params }: { params: { systemId: string } },
) {
  const body = await request.json();
  const updatedSystem = updateSystem(params.systemId, body);

  if (!updatedSystem) {
    return NextResponse.json({ error: "System not found" }, { status: 404 });
  }

  return NextResponse.json({ updatedSystem });
}

export async function DELETE(
  request: Request,
  { params }: { params: { systemId: string } },
) {
  const deleted = deleteSystem(params.systemId);

  if (!deleted) {
    return NextResponse.json({ error: "System not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
