import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/auth";
import { can } from "@/domain/roles";
import { createEvaluation } from "@/lib/queries/evaluations";
import type { EvaluationKind } from "@/domain/rubric";

export async function POST(request: Request) {
  const account = await getCurrentAccount();
  if (!account || !can(account.role, "writeEvaluation")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }
  const body = (await request.json()) as {
    kind?: EvaluationKind;
    notes?: string;
    playerA?: string;
    playerB?: string;
    score?: string;
    sessionDrills?: string[];
    traineeUserId?: string;
    sessionRef?: string;
  };
  if (!body.kind || !body.notes) {
    return NextResponse.json({ error: "Jenis dan catatan wajib diisi" }, { status: 400 });
  }
  const report = await createEvaluation({
    ...body,
    kind: body.kind,
    notes: body.notes,
    createdBy: account.id,
  });
  return NextResponse.json({ report });
}