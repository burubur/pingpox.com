import { sql } from "@/lib/db";
import { newId } from "@/lib/id";
import { evaluateWithRubric, type EvaluationKind, type EvaluationReport } from "@/domain/rubric";

export async function createEvaluation(input: {
  kind: EvaluationKind;
  notes: string;
  playerA?: string;
  playerB?: string;
  score?: string;
  sessionDrills?: string[];
  traineeUserId?: string;
  sessionRef?: string;
  createdBy?: string;
}): Promise<EvaluationReport & { id: string }> {
  let report: EvaluationReport;
  const apiKey = process.env.AI_API_KEY?.trim();
  const apiBase = process.env.AI_API_BASE?.trim() || "https://api.openai.com/v1";

  if (apiKey) {
    try {
      report = await evaluateWithModel(apiBase, apiKey, input);
    } catch {
      report = evaluateWithRubric(input);
    }
  } else {
    report = evaluateWithRubric(input);
  }

  const id = newId("evl");
  await sql(
    `insert into evaluations (id, kind, notes, player_a, player_b, score, summary, strengths, improvements, next_session, source, trainee_user_id, session_ref, created_by)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      id,
      input.kind,
      input.notes,
      input.playerA ?? null,
      input.playerB ?? null,
      input.score ?? null,
      report.summary,
      JSON.stringify(report.strengths),
      JSON.stringify(report.improvements),
      report.nextSession,
      report.source,
      input.traineeUserId ?? null,
      input.sessionRef ?? null,
      input.createdBy ?? null,
    ],
  );
  return { id, ...report };
}

async function evaluateWithModel(
  apiBase: string,
  apiKey: string,
  input: {
    kind: EvaluationKind;
    notes: string;
    playerA?: string;
    playerB?: string;
    score?: string;
    sessionDrills?: string[];
  },
): Promise<EvaluationReport> {
  const prompt = `Return JSON with keys summary, strengths (array), improvements (array), nextSession.
Kind: ${input.kind}
Notes: ${input.notes}
Players: ${input.playerA ?? ""} vs ${input.playerB ?? ""}
Score: ${input.score ?? ""}
Drills: ${(input.sessionDrills ?? []).join("; ")}`;

  const res = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a table tennis coach. Reply with JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error("model failed");
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content.replace(/```json|```/g, "").trim()) as {
    summary: string;
    strengths: string[];
    improvements: string[];
    nextSession: string;
  };
  return { ...parsed, source: "model" };
}

export async function listEvaluations(traineeUserId?: string) {
  if (traineeUserId) {
    return sql<{
      id: string;
      kind: string;
      summary: string;
      source: string;
      next_session: string;
      created_at: string;
    }>(
      `select id, kind, summary, source, next_session, created_at from evaluations
       where trainee_user_id = $1
       order by created_at desc limit 50`,
      [traineeUserId],
    );
  }
  return sql<{
    id: string;
    kind: string;
    summary: string;
    source: string;
    next_session: string;
    created_at: string;
  }>(
    `select id, kind, summary, source, next_session, created_at from evaluations
     order by created_at desc limit 50`,
  );
}
