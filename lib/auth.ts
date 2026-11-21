import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { sql, sqlOne } from "./db";
import { newId } from "./id";
import type { Role } from "@/domain/roles";

const SESSION_COOKIE = "pingpox_session";
const SESSION_DAYS = 14;

export type Account = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
};

type AccountRow = {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  role: Role;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAccount(input: {
  email: string;
  password: string;
  displayName: string;
  role?: Role;
}): Promise<Account> {
  const id = newId("acc");
  const passwordHash = await hashPassword(input.password);
  const role = input.role ?? "member";
  await sql(
    `insert into accounts (id, email, password_hash, display_name, role)
     values ($1, $2, $3, $4, $5)`,
    [id, input.email.toLowerCase().trim(), passwordHash, input.displayName, role],
  );
  return {
    id,
    email: input.email.toLowerCase().trim(),
    displayName: input.displayName,
    role,
  };
}

export async function findAccountByEmail(
  email: string,
): Promise<(Account & { passwordHash: string }) | null> {
  const row = await sqlOne<AccountRow>(
    `select id, email, password_hash, display_name, role from accounts where email = $1`,
    [email.toLowerCase().trim()],
  );
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    passwordHash: row.password_hash,
  };
}

export function sessionCookieOptions(expires: Date) {
  const secure =
    process.env.NODE_ENV === "production" ||
    (process.env.NEXT_PUBLIC_APP_URL ?? "").startsWith("https://");
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    expires,
  };
}

export async function createSessionToken(accountId: string): Promise<{
  token: string;
  expires: Date;
}> {
  const token = newId("tok");
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  await sql(
    `insert into auth_sessions (id, account_id, token, expires_at) values ($1, $2, $3, $4)`,
    [newId("sess"), accountId, token, expires.toISOString()],
  );
  return { token, expires };
}

export async function createSession(accountId: string): Promise<string> {
  const { token, expires } = await createSessionToken(accountId);
  cookies().set(SESSION_COOKIE, token, sessionCookieOptions(expires));
  return token;
}

export async function destroySession(): Promise<void> {
  const jar = cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await sql(`delete from auth_sessions where token = $1`, [token]);
  }
  jar.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export { SESSION_COOKIE };

export async function getCurrentAccount(): Promise<Account | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = await sqlOne<AccountRow & { expires_at: string }>(
    `select a.id, a.email, a.password_hash, a.display_name, a.role, s.expires_at
     from auth_sessions s
     join accounts a on a.id = s.account_id
     where s.token = $1`,
    [token],
  );
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    await sql(`delete from auth_sessions where token = $1`, [token]);
    return null;
  }
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
  };
}

export async function updateAccountRole(
  accountId: string,
  role: Role,
): Promise<void> {
  await sql(`update accounts set role = $1 where id = $2`, [role, accountId]);
}
