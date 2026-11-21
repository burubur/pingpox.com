import { describe, expect, it } from "vitest";
import {
  filterAndRankPlayers,
  formatPlayerName,
  regionLine,
  type PlayerRecord,
} from "@/domain/players";

const sample: PlayerRecord[] = [
  {
    id: "1",
    name: "Andi Pratama",
    club: "A",
    gender: "men",
    birthYear: 1998,
    ranking: 2,
    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    district: "Kebayoran Baru",
    subdistrict: "Senayan",
    postalCode: "12190",
  },
  {
    id: "2",
    name: "Citra Lestari",
    club: "B",
    gender: "women",
    birthYear: 2000,
    ranking: 1,
    province: "Jawa Barat",
    city: "Kota Bandung",
    district: "Coblong",
    subdistrict: "Dago",
    postalCode: "40135",
  },
  {
    id: "3",
    name: "Budi Santoso",
    club: "C",
    gender: "men",
    birthYear: 2001,
    ranking: 1,
    province: "Jawa Timur",
    city: "Surabaya",
    district: null,
    subdistrict: null,
    postalCode: null,
  },
];

describe("players", () => {
  it("filters by gender and ranks within the filtered set", () => {
    const ranked = filterAndRankPlayers(sample, { gender: "men" });
    expect(ranked).toHaveLength(2);
    expect(ranked[0].name).toBe("Budi Santoso");
    expect(ranked[0].listIndex).toBe(1);
  });

  it("filters by province and search", () => {
    const ranked = filterAndRankPlayers(sample, {
      gender: "men",
      province: "DKI Jakarta",
      search: "andi",
    });
    expect(ranked).toHaveLength(1);
    expect(regionLine(ranked[0], "postalCode")).toContain("12190");
  });

  it("formats player names WTT-style with uppercase surname", () => {
    expect(formatPlayerName("Felix Lebrun")).toBe("Felix LEBRUN");
    expect(formatPlayerName("andi pratama")).toBe("Andi PRATAMA");
  });
});
