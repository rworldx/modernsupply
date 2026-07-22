import { NextResponse } from "next/server";
import { checkCredentials, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { username = "", password = "" } = body;
  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
