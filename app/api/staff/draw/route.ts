import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/auth";
import { can } from "@/domain/roles";
import {
  advanceEventToElimination,
  buildQualification,
  recordMatchScore,
  setEntryStatus,
  addExhibitionMatch,
} from "@/lib/queries/events";

export async function POST(request: Request) {
  const account = await getCurrentAccount();
  if (!account || !can(account.role, "buildDraw")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }
  const body = (await request.json()) as {
    action?: string;
    eventId?: string;
    matchId?: string;
    scoreA?: number;
    scoreB?: number;
    entryId?: string;
    status?: "pending" | "confirmed" | "withdrawn";
    playerAId?: string;
    playerBId?: string;
  };

  try {
    if (body.action === "buildQualification" && body.eventId) {
      await buildQualification(body.eventId);
      return NextResponse.json({ ok: true });
    }
    if (body.action === "advance" && body.eventId) {
      await advanceEventToElimination(body.eventId);
      return NextResponse.json({ ok: true });
    }
    if (
      body.action === "recordScore" &&
      body.matchId &&
      body.scoreA != null &&
      body.scoreB != null
    ) {
      await recordMatchScore(body.matchId, body.scoreA, body.scoreB);
      return NextResponse.json({ ok: true });
    }
    if (body.action === "setEntry" && body.entryId && body.status) {
      await setEntryStatus(body.entryId, body.status);
      return NextResponse.json({ ok: true });
    }
    if (
      body.action === "addExhibitionMatch" &&
      body.eventId &&
      body.playerAId &&
      body.playerBId
    ) {
      await addExhibitionMatch(body.eventId, body.playerAId, body.playerBId);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal" },
      { status: 400 },
    );
  }
}