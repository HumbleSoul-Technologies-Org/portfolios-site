import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore?.get?.("session")?.value;
    const username = verifySession(token);

    if (!username) return NextResponse.json({ authenticated: false }, { status: 401 });

    return NextResponse.json({ authenticated: true, username });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
} 
