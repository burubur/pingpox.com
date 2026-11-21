import { NextResponse } from "next/server";
import { getCurrentAccount, updateAccountRole } from "@/lib/auth";
import { can, type Role } from "@/domain/roles";
import { sql } from "@/lib/db";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || !can(account.role, "manageRoles")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }
  const rows = await sql<{ id: string; email: string; display_name: string; role: Role }>(
    `select id, email, display_name, role from accounts order by display_name`,
  );
  return NextResponse.json({ accounts: rows });
}

export async function POST(request: Request) {
  const account = await getCurrentAccount();
  if (!account || !can(account.role, "manageRoles")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }
  const body = (await request.json()) as { accountId?: string; role?: Role };
  if (!body.accountId || !body.role) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }
  await updateAccountRole(body.accountId, body.role);
  return NextResponse.json({ ok: true });
}