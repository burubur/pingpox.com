export type SeededPlayer = {
  id: string;
  ranking: number;
};

export type GroupAssignment = {
  groupIndex: number;
  playerId: string;
  seedInGroup: number;
};

export type RoundRobinMatch = {
  groupIndex: number;
  playerAId: string;
  playerBId: string;
  round: number;
};

export type StandingRow = {
  playerId: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
};

export type BracketSlot = {
  round: number;
  slot: number;
  playerId: string | null;
  isBye: boolean;
};

/** Snake-seed players into groups by ranking (best first). */
export function snakeSeedGroups(
  players: SeededPlayer[],
  groupSize = 4,
): GroupAssignment[] {
  const sorted = [...players].sort((a, b) => a.ranking - b.ranking);
  const groupCount = Math.max(1, Math.ceil(sorted.length / groupSize));
  const assignments: GroupAssignment[] = [];
  const counters = Array.from({ length: groupCount }, () => 0);

  sorted.forEach((player, index) => {
    const cycle = Math.floor(index / groupCount);
    const posInCycle = index % groupCount;
    const groupIndex = cycle % 2 === 0 ? posInCycle : groupCount - 1 - posInCycle;
    assignments.push({
      groupIndex,
      playerId: player.id,
      seedInGroup: counters[groupIndex]++,
    });
  });

  return assignments;
}

/** Build round-robin matches for each group. */
export function buildRoundRobin(
  assignments: GroupAssignment[],
): RoundRobinMatch[] {
  const byGroup = new Map<number, string[]>();
  for (const a of assignments) {
    const list = byGroup.get(a.groupIndex) ?? [];
    list.push(a.playerId);
    byGroup.set(a.groupIndex, list);
  }

  const matches: RoundRobinMatch[] = [];
  for (const [groupIndex, ids] of Array.from(byGroup.entries())) {
    let round = 0;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        matches.push({
          groupIndex,
          playerAId: ids[i],
          playerBId: ids[j],
          round: round++,
        });
      }
    }
  }
  return matches;
}

export function updateStandings(
  standings: StandingRow[],
  winnerId: string,
  loserId: string,
  winnerScore: number,
  loserScore: number,
): StandingRow[] {
  const next = standings.map((s) => ({ ...s }));
  const winner = next.find((s) => s.playerId === winnerId);
  const loser = next.find((s) => s.playerId === loserId);
  if (winner) {
    winner.wins += 1;
    winner.pointsFor += winnerScore;
    winner.pointsAgainst += loserScore;
  }
  if (loser) {
    loser.losses += 1;
    loser.pointsFor += loserScore;
    loser.pointsAgainst += winnerScore;
  }
  return next;
}

export function rankGroup(
  standings: StandingRow[],
): StandingRow[] {
  return [...standings].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    const diffA = a.pointsFor - a.pointsAgainst;
    const diffB = b.pointsFor - b.pointsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    return b.pointsFor - a.pointsFor;
  });
}

/** Take top N from each group, reseed by ranking, pad with byes to power of 2. */
export function advanceToElimination(
  groupStandings: StandingRow[][],
  advanceCount: number,
  rankings: Map<string, number>,
): BracketSlot[] {
  const advanced: SeededPlayer[] = [];
  for (const group of groupStandings) {
    const ranked = rankGroup(group);
    for (let i = 0; i < Math.min(advanceCount, ranked.length); i++) {
      const id = ranked[i].playerId;
      advanced.push({ id, ranking: rankings.get(id) ?? 9999 });
    }
  }
  advanced.sort((a, b) => a.ranking - b.ranking);

  const size = nextPowerOfTwo(Math.max(2, advanced.length));
  const slots: BracketSlot[] = [];
  for (let i = 0; i < size; i++) {
    const player = advanced[i];
    slots.push({
      round: 1,
      slot: i,
      playerId: player?.id ?? null,
      isBye: !player,
    });
  }
  return slots;
}

export function nextPowerOfTwo(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/** Place winner into the next round slot. */
export function nextBracketSlot(
  currentRound: number,
  currentSlot: number,
): { round: number; slot: number } {
  return {
    round: currentRound + 1,
    slot: Math.floor(currentSlot / 2),
  };
}

export function buildEliminationMatches(
  slots: BracketSlot[],
): Array<{
  round: number;
  slot: number;
  playerAId: string | null;
  playerBId: string | null;
  isBye: boolean;
}> {
  const firstRound = slots.filter((s) => s.round === 1);
  const matches = [];
  for (let i = 0; i < firstRound.length; i += 2) {
    const a = firstRound[i];
    const b = firstRound[i + 1];
    const isBye = Boolean(a?.isBye || b?.isBye || !a?.playerId || !b?.playerId);
    matches.push({
      round: 1,
      slot: Math.floor(i / 2),
      playerAId: a?.isBye ? null : a?.playerId ?? null,
      playerBId: b?.isBye ? null : b?.playerId ?? null,
      isBye,
    });
  }
  return matches;
}
