export type PlayerGender = "men" | "women";

export type PlayerRecord = {
  id: string;
  name: string;
  club: string | null;
  gender: PlayerGender;
  birthYear: number;
  ranking: number;
  province: string;
  city: string;
  district: string | null;
  subdistrict: string | null;
  postalCode: string | null;
};

export type PlayerFilters = {
  gender: PlayerGender;
  search?: string;
  province?: string;
  city?: string;
  district?: string;
  subdistrict?: string;
  postalCode?: string;
};

export type RankedPlayer = PlayerRecord & { listIndex: number };

export function filterAndRankPlayers(
  players: PlayerRecord[],
  filters: PlayerFilters,
): RankedPlayer[] {
  const q = filters.search?.trim().toLowerCase() ?? "";
  const filtered = players
    .filter((p) => p.gender === filters.gender)
    .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
    .filter((p) => (filters.province ? p.province === filters.province : true))
    .filter((p) => (filters.city ? p.city === filters.city : true))
    .filter((p) => (filters.district ? p.district === filters.district : true))
    .filter((p) =>
      filters.subdistrict ? p.subdistrict === filters.subdistrict : true,
    )
    .filter((p) =>
      filters.postalCode ? p.postalCode === filters.postalCode : true,
    )
    .sort((a, b) => a.ranking - b.ranking || a.name.localeCompare(b.name));

  return filtered.map((p, index) => ({ ...p, listIndex: index + 1 }));
}

export function regionLine(
  player: Pick<
    PlayerRecord,
    "city" | "province" | "district" | "subdistrict" | "postalCode"
  >,
  detail?: "district" | "subdistrict" | "postalCode",
): string {
  const parts = [player.city, player.province];
  if (detail === "district" || detail === "subdistrict" || detail === "postalCode") {
    if (player.district) parts.unshift(player.district);
  }
  if (detail === "subdistrict" || detail === "postalCode") {
    if (player.subdistrict) parts.unshift(player.subdistrict);
  }
  if (detail === "postalCode" && player.postalCode) {
    parts.unshift(player.postalCode);
  }
  return parts.filter(Boolean).join(" · ");
}

/** WTT-style display: given name mixed case, family name UPPERCASE. */
export function formatPlayerName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name;
  if (parts.length === 1) return parts[0]!.toUpperCase();
  const family = parts[parts.length - 1]!.toUpperCase();
  const given = parts
    .slice(0, -1)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
  return `${given} ${family}`;
}
