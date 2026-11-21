import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/auth";
import { can } from "@/domain/roles";
import { confirmSubscription, declineSubscription } from "@/lib/queries/training";

export async function POST(request: Request) {
  const account = await getCurrentAccount();
  if (!account || !can(account.role, "confirmSubscription")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }
  const body = (await request.json()) as {
    subscriptionId?: string;
    action?: "confirm" | "decline";
  };
  if (!body.subscriptionId || !body.action) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }
  if (body.action === "confirm") {
    await confirmSubscription(body.subscriptionId, account.role);
  } else {
    await declineSubscription(body.subscriptionId);
  }
  return NextResponse.json({ ok: true });
}