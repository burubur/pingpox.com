import fs from "node:fs";
import path from "node:path";
import { normalize, type RawTournament, type Tournament } from "./tournament";

/** The only data file. The scouting bot replaces it to update the site (see README). */
export const DATA_FILE = path.join(process.cwd(), "data", "tournaments.json");

export type SiteData = {
  updatedAt: string | null;
  tournaments: Tournament[];
};

let cache: SiteData | null = null;

/**
 * Reads and normalizes data/tournaments.json at build time. A malformed file fails the build,
 * so a bad data push never replaces the live site.
 */
export function getSiteData(): SiteData {
  if (cache) return cache;
  const raw: unknown = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as { tournaments?: unknown }).tournaments)) {
    throw new Error(`${DATA_FILE}: field "tournaments" harus berupa array.`);
  }
  const doc = raw as { updated_at?: unknown; tournaments: unknown[] };
  const seen = new Set<string>();
  const tournaments = doc.tournaments
    .filter((t): t is RawTournament => !!t && typeof t === "object" && !Array.isArray(t))
    .map(normalize)
    .filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));
  cache = {
    updatedAt: typeof doc.updated_at === "string" ? doc.updated_at : null,
    tournaments,
  };
  return cache;
}

export function getTournament(id: string): Tournament | undefined {
  return getSiteData().tournaments.find((t) => t.id === id);
}
