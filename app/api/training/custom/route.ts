import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/auth";
import { can } from "@/domain/roles";
import {
  acceptCustomRequest,
  createCustomRequest,
  declineCustomRequest,
} from "@/lib/queries/training";

export async function POST(request: Request) {
  const account = await getCurrentAccount();
  const body = (await request.json()) as {
    action?: "request" | "accept" | "decline";
    subscriptionId?: string;
    goal?: string;
    sessionCount?: number;
    topicIds?: string[];
    requestId?: string;
    reason?: string;
    sessions?: Array<{ durationHours: number; topicIds: string[]; drills: string[] }>;
  };

  if (body.action === "request") {
    if (!account || !can(account.role, "requestCustomCourse")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    if (!body.subscriptionId || !body.goal || !body.sessionCount || !body.topicIds) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }
    const id = await createCustomRequest({
      userId: account.id,
      subscriptionId: body.subscriptionId,
      goal: body.goal,
      sessionCount: body.sessionCount,
      topicIds: body.topicIds,
    });
    return NextResponse.json({ id });
  }

  if (!account || !can(account.role, "acceptCustomCourse")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }
  if (body.action === "accept" && body.requestId && body.sessions) {
    await acceptCustomRequest(body.requestId, body.sessions);
    return NextResponse.json({ ok: true });
  }
  if (body.action === "decline" && body.requestId) {
    await declineCustomRequest(body.requestId, body.reason ?? "Ditolak");
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
}