import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const jar = cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await sql(`delete from auth_sessions where token = $1`, [token]);
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}