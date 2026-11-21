export type EvaluationKind = "exercise" | "training" | "match";

export type EvaluationReport = {
  summary: string;
  strengths: string[];
  improvements: string[];
  nextSession: string;
  source: "model" | "rubric";
};

export function evaluateWithRubric(input: {
  kind: EvaluationKind;
  notes: string;
  playerA?: string;
  playerB?: string;
  score?: string;
  sessionDrills?: string[];
}): EvaluationReport {
  const notes = input.notes.trim();
  const lower = notes.toLowerCase();
  const strengths: string[] = [];
  const improvements: string[] = [];

  const positive = ["good", "strong", "solid", "clean", "confident", "baik", "kuat"];
  const negative = ["weak", "late", "rush", "miss", "error", "lemah", "terlambat"];
  for (const word of positive) {
    if (lower.includes(word)) strengths.push(`Noted positive cue: "${word}"`);
  }
  for (const word of negative) {
    if (lower.includes(word)) improvements.push(`Address cue: "${word}"`);
  }

  if (notes.length > 80) {
    strengths.push("Notes are specific enough to guide the next session");
  } else {
    improvements.push("Add more concrete detail about ball contact and recovery");
  }

  const nextMatch = notes.match(/next[:\s]+([^.!\n]+)/i);
  const nextSession =
    nextMatch?.[1]?.trim() ||
    (input.sessionDrills?.[0]
      ? `Repeat focus on: ${input.sessionDrills[0]}`
      : "Short serve, long push, then attack");

  if (!nextMatch) {
    improvements.push("Name an explicit next-session focus");
  }

  const matchLine =
    input.kind === "match" && input.playerA && input.playerB
      ? `Match ${input.playerA} vs ${input.playerB}${input.score ? ` (${input.score})` : ""}. `
      : "";

  const summary =
    `${matchLine}Built-in rubric review for ${input.kind}: ` +
    `${strengths.length} strength cue(s), ${improvements.length} improvement cue(s).`;

  return {
    summary,
    strengths: strengths.length ? strengths : ["Showed up and recorded the session"],
    improvements: improvements.length
      ? improvements
      : ["Keep notes tied to one placement pattern"],
    nextSession,
    source: "rubric",
  };
}
