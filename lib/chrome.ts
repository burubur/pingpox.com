import {
  compareByStart,
  eventHref,
  fmtRange,
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
  start: DayKey;
  last: DayKey;
  unconfirmed: boolean;
  tone: number;
};

export const LIST_HREF = "/#jadwal";
export const CALENDAR_HREF = "/?tampilan=kalender#jadwal";

/** Dated public events, including ones that are already over. Sample rows are omitted. */
export function chromeCandidates(tournaments: Tournament[]): ChromeEvent[] {
  return tournaments
    .filter((t) => !t.sample && t.start && t.last)
    .sort(compareByStart)
    .map((t) => ({
      href: eventHref(t),
      name: t.name,
      when: fmtRange(t.start, t.end),
      place: placeLine(t) || "Lokasi belum diumumkan",
      start: t.start as DayKey,
      last: t.last as DayKey,
      unconfirmed: t.unconfirmed,
      tone: t.tone,
    }));
}

export function isChromeLive(event: ChromeEvent, today: DayKey): boolean {
  return event.start <= today && event.last >= today;
}

/** In progress or still ahead of today. */
export function upcomingChrome(events: ChromeEvent[], today: DayKey): ChromeEvent[] {
  return events.filter((event) => event.last >= today);
}

/**
 * The next event that has not started. When every remaining row is already
 * underway, the earliest of those is returned as live instead.
 */
export function featuredEvent(
  events: ChromeEvent[],
  today: DayKey,
): { event: ChromeEvent; kind: "next" | "live" } | null {
  const upcoming = upcomingChrome(events, today);
  const next = upcoming.find((event) => event.start > today);
  if (next) return { event: next, kind: "next" };
  const live = upcoming.find((event) => isChromeLive(event, today));
  return live ? { event: live, kind: "live" } : null;
}
