import fs from "node:fs";
import path from "node:path";
import type { Player, PlayerGender, PlayerMatch } from "./player";

/** Player directory. Empty until a later, separately approved data update. */
export const PLAYERS_FILE = path.join(process.cwd(), "data", "players.json");

const GENDERS = new Set<PlayerGender>(["putra", "putri"]);

function str(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function matches(value: unknown): PlayerMatch[] {
  if (!Array.isArray(value)) return [];
  const rows: PlayerMatch[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const row = item as { tournament?: unknown; when?: unknown; outcome?: unknown };
    const tournament = str(row.tournament);
    if (!tournament) continue;
    rows.push({ tournament, when: str(row.when), outcome: str(row.outcome) });
  }
  return rows;
}

function normalize(raw: object): Player | null {
  const row = raw as Record<string, unknown>;
  const id = str(row.id);
  const name = str(row.name);
  if (!id || !name) return null;
  const gender = str(row.gender);
  return {
    id,
    name,
    gender: gender && GENDERS.has(gender as PlayerGender) ? (gender as PlayerGender) : null,
    province: str(row.province),
    category: str(row.category),
    rank: num(row.rank),
    matches: num(row.matches),
    wins: num(row.wins),
    results: matches(row.results),
    history: matches(row.history),
  };
}

let cache: Player[] | null = null;

/** Reads data/players.json. A non-array file fails the build. Contact fields are never read. */
export function getPlayers(): Player[] {
  if (cache) return cache;
  const raw: unknown = JSON.parse(fs.readFileSync(PLAYERS_FILE, "utf8"));
  if (!Array.isArray(raw)) {
    throw new Error(`${PLAYERS_FILE}: harus berupa array.`);
  }
  const seen = new Set<string>();
  cache = raw
    .filter((row): row is object => !!row && typeof row === "object" && !Array.isArray(row))
    .map(normalize)
    .filter((player): player is Player => {
      if (!player || seen.has(player.id)) return false;
      seen.add(player.id);
      return true;
    });
  return cache;
}

export function getPlayer(id: string): Player | undefined {
  return getPlayers().find((player) => player.id === id);
}
