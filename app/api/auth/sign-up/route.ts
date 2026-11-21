import { NextResponse } from "next/server";
import {
  createAccount,
  createSessionToken,
  findAccountByEmail,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    displayName?: string;
  };
  if (!body.email || !body.password || !body.displayName) {
    return NextResponse.json({ error: "Lengkapi semua kolom" }, { status: 400 });
  }
  const existing = await findAccountByEmail(body.email);
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
  }
  const account = await createAccount({
    email: body.email,
    password: body.password,
    displayName: body.displayName,
  });
  const { token, expires } = await createSessionToken(account.id);
  const response = NextResponse.json({ account });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expires));
  return response;
}