import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/auth";
import { can } from "@/domain/roles";
import { enroll } from "@/lib/queries/training";
import type { CourseShape, SubscriptionMethod } from "@/domain/subscriptions";

export async function POST(request: Request) {
  const account = await getCurrentAccount();
  if (!account || !can(account.role, "enrollTraining")) {
    return NextResponse.json(
      { error: "Masuk sebagai anggota untuk mendaftar latihan" },
      { status: 401 },
    );
  }
  const body = (await request.json()) as {
    method?: SubscriptionMethod;
    courseShape?: CourseShape;
  };
  if (!body.method || !body.courseShape) {
    return NextResponse.json({ error: "Pilih paket latihan" }, { status: 400 });
  }
  const sub = await enroll(account.id, body.method, body.courseShape);
  return NextResponse.json({ subscription: sub });
}