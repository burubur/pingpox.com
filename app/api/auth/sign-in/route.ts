import { NextResponse } from "next/server";
import {
  createSessionToken,
  findAccountByEmail,
  sessionCookieOptions,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Lengkapi email dan kata sandi" }, { status: 400 });
  }
  const account = await findAccountByEmail(body.email);
  if (!account || !(await verifyPassword(body.password, account.passwordHash))) {
    return NextResponse.json({ error: "Email atau kata sandi salah" }, { status: 401 });
  }
  const { token, expires } = await createSessionToken(account.id);
  const response = NextResponse.json({
    account: {
      id: account.id,
      email: account.email,
      displayName: account.displayName,
      role: account.role,
    },
  });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expires));
  return response;
}