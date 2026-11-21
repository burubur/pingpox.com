import { describe, expect, it } from "vitest";
import {
  advanceToElimination,
  buildEliminationMatches,
  buildRoundRobin,
  nextBracketSlot,
  nextPowerOfTwo,
  snakeSeedGroups,
  updateStandings,
} from "@/domain/draw";

describe("draw", () => {
  it("snake-seeds into groups of 4", () => {
    const players = Array.from({ length: 8 }, (_, i) => ({
      id: `p${i + 1}`,
      ranking: i + 1,
    }));
    const groups = snakeSeedGroups(players, 4);
    expect(groups.filter((g) => g.groupIndex === 0)).toHaveLength(4);
    expect(groups.filter((g) => g.groupIndex === 1)).toHaveLength(4);
    expect(groups.find((g) => g.playerId === "p1")?.groupIndex).toBe(0);
  });

  it("builds round-robin pairs", () => {
    const assignments = snakeSeedGroups(
      [
        { id: "a", ranking: 1 },
        { id: "b", ranking: 2 },
        { id: "c", ranking: 3 },
        { id: "d", ranking: 4 },
      ],
      4,
    );
    const matches = buildRoundRobin(assignments);
    expect(matches).toHaveLength(6);
  });

  it("updates standings and advances with byes", () => {
    const standings = [
      { playerId: "a", wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 },
      { playerId: "b", wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 },
    ];
    const next = updateStandings(standings, "a", "b", 3, 1);
    expect(next.find((s) => s.playerId === "a")?.wins).toBe(1);

    const slots = advanceToElimination(
      [
        [
          { playerId: "a", wins: 2, losses: 0, pointsFor: 6, pointsAgainst: 1 },
          { playerId: "b", wins: 1, losses: 1, pointsFor: 4, pointsAgainst: 4 },
        ],
        [
          { playerId: "c", wins: 2, losses: 0, pointsFor: 6, pointsAgainst: 2 },
          { playerId: "d", wins: 0, losses: 2, pointsFor: 1, pointsAgainst: 6 },
        ],
      ],
      2,
      new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
        ["d", 4],
      ]),
    );
    expect(nextPowerOfTwo(slots.length)).toBe(slots.length);
    expect(buildEliminationMatches(slots).length).toBeGreaterThan(0);
    expect(nextBracketSlot(1, 3)).toEqual({ round: 2, slot: 1 });
  });
});
