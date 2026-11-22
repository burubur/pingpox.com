import {
  compareByStart,
  eventHref,
  fmtRange,
  isLive,
  placeLine,
  type DayKey,
  type Tournament,
} from "./tournament";

/** A public-schedule row the shell can link to. Built only from tournaments.json. */
export type ChromeEvent = {
  href: string;
  name: string;
  when: string;
  place: string;
  live: boolean;
  unconfirmed: boolean;
  tone: number;
};

/** In-progress and upcoming events. Sample rows are omitted. */
export function scheduleEvents(tournaments: Tournament[], today: DayKey): ChromeEvent[] {
  return tournaments
    .filter((t) => !t.sample && t.start && t.last && t.last >= today)
    .sort(compareByStart)
    .map((t) => ({
      href: eventHref(t),
      name: t.name,
      when: fmtRange(t.start, t.end),
      place: placeLine(t) || "Lokasi belum diumumkan",
      live: isLive(t, today),
      unconfirmed: t.unconfirmed,
      tone: t.tone,
    }));
}

/**
 * The next event that has not started. When every remaining row is already
 * underway, the earliest of those is returned as live instead.
 */
export function featuredEvent(events: ChromeEvent[]): { event: ChromeEvent; kind: "next" | "live" } | null {
  const next = events.find((event) => !event.live);
  if (next) return { event: next, kind: "next" };
  const live = events.find((event) => event.live);
  return live ? { event: live, kind: "live" } : null;
}
