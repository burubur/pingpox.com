export type PlayerGender = "putra" | "putri";

export type PlayerMatch = {
  tournament: string;
  when: string | null;
  outcome: string | null;
};

export type Player = {
  id: string;
  name: string;
  gender: PlayerGender | null;
  province: string | null;
  category: string | null;
  rank: number | null;
  matches: number | null;
  wins: number | null;
  results: PlayerMatch[];
  history: PlayerMatch[];
};

export function genderLabel(gender: PlayerGender | null): string | null {
  if (gender === "putra") return "Putra";
  if (gender === "putri") return "Putri";
  return null;
}
