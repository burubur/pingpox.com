import { NextResponse } from "next/server";
import { createPlayer } from "@/lib/queries/players";
import { registerPlayer } from "@/lib/queries/events";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    eventId?: string;
    playerId?: string;
    player?: {
      name: string;
      gender: "men" | "women";
      birthYear: number;
      ranking: number;
      province: string;
      city: string;
      district?: string;
      subdistrict?: string;
      postalCode?: string;
    };
  };
  if (!body.eventId) {
    return NextResponse.json({ ok: false, error: "Acara tidak ditemukan" }, { status: 400 });
  }
  let playerId = body.playerId;
  if (!playerId && body.player) {
    const created = await createPlayer(body.player);
    playerId = created.id;
  }
  if (!playerId) {
    return NextResponse.json({ ok: false, error: "Pemain tidak ditemukan" }, { status: 400 });
  }
  const result = await registerPlayer(body.eventId, playerId);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}