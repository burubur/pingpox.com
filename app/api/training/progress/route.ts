import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/auth";
import { can } from "@/domain/roles";
import { markSessionDone } from "@/lib/queries/training";

export async function POST(request: Request) {
  const account = await getCurrentAccount();
  if (!account || !can(account.role, "markSessionDone")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }
  const body = (await request.json()) as {
    userId?: string;
    courseKey?: string;
    sessionOrder?: number;
  };
  if (!body.userId || !body.courseKey || body.sessionOrder == null) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }
  await markSessionDone(body.userId, body.courseKey, body.sessionOrder);
  return NextResponse.json({ ok: true });
}