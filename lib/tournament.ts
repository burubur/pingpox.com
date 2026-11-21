// Pure helpers shared by server and client components. No Node or browser APIs here.

/** A calendar day as "YYYY-MM-DD". Compared as strings; never converted through a time zone. */
export type DayKey = string;

/** One entry of data/tournaments.json, as the bot writes it (see README "Data format"). */
export type RawTournament = {
  id?: unknown;
  name?: unknown;
  start_date?: unknown;
  end_date?: unknown;
  city?: unknown;
  province?: unknown;
  venue?: unknown;
  categories?: unknown;
  /** Older name for `categories`. */
  divisions?: unknown;
  registration_fee?: unknown;
  registration_deadline?: unknown;
  organizer?: unknown;
  contact?: unknown;
  source_urls?: unknown;
  /** Older single-URL form of `source_urls`. */
  source_url?: unknown;
  date_found?: unknown;
  status?: unknown;
  notes?: unknown;
  sample?: unknown;
};

/** A tournament after normalization. Plain data, so it can cross the server/client boundary. */
export type Tournament = {
  id: string;
  name: string;
  start: DayKey | null;
  end: DayKey | null;
  /** Last day of the event: `end` when it is a valid end, otherwise `start`. */
  last: DayKey | null;
  city: string;
  province: string;
  venue: string | null;
  organizer: string | null;
  fee: string | null;
  contact: string | null;
  notes: string | null;
  /** Parsed deadline, or null when it is missing or not a date. */
  deadline: DayKey | null;
  /** Deadline text as written, shown when it is not a parseable date. */
  deadlineText: string | null;
  dateFound: DayKey | null;
  categories: string[];
  sources: string[];
  sample: boolean;
  unconfirmed: boolean;
  /** Lower-cased text the search box matches against. */
  search: string;
  /** Index of the banner gradient (0-4), stable per id. */
  tone: number;
};

export const NA = "Belum diumumkan";
export const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export const BULAN_PANJANG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
export const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
export const SITE_NAME = "Jadwal Turnamen Tenis Meja Indonesia";

function blank(v: unknown): boolean {
  return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
}

/** Optional text field: null when null, missing or "". */
function text(v: unknown): string | null {
  return blank(v) ? null : String(v).trim();
}

function textList(v: unknown): string[] {
  const items = Array.isArray(v) ? v : [v];
  return items.filter((x) => !blank(x)).map((x) => String(x).trim());
}

/** Reads the leading "YYYY-MM-DD" of a value; null when absent or not a real date. */
export function parseDay(v: unknown): DayKey | null {
  if (blank(v)) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v));
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCMonth() === +m[2] - 1 ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

function parts(k: DayKey): [number, number, number] {
  const [y, m, d] = k.split("-").map(Number);
  return [y, m - 1, d];
}

function toKey(y: number, m: number, d: number): DayKey {
  const x = new Date(Date.UTC(y, m, d));
  return `${x.getUTCFullYear()}-${String(x.getUTCMonth() + 1).padStart(2, "0")}-${String(x.getUTCDate()).padStart(2, "0")}`;
}

export function dayNumber(k: DayKey): number {
  return Number(k.split("-")[2]);
}

export function monthIndex(k: DayKey): number {
  return parts(k)[1];
}

/** "YYYY-MM" of a day. */
export function monthKey(k: DayKey): string {
  return k.slice(0, 7);
}

export function addDays(k: DayKey, n: number): DayKey {
  const [y, m, d] = parts(k);
  return toKey(y, m, d + n);
}

export function daysBetween(a: DayKey, b: DayKey): number {
  const [ay, am, ad] = parts(a);
  const [by, bm, bd] = parts(b);
  return Math.round((Date.UTC(by, bm, bd) - Date.UTC(ay, am, ad)) / 86400000);
}

/** Today as a DayKey in the given IANA zone, or in the runtime's local zone when omitted. */
export function todayKey(timeZone?: string): DayKey {
  const now = new Date();
  if (!timeZone) return toKey(now.getFullYear(), now.getMonth(), now.getDate());
  const p = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return p;
}

/** Milliseconds of local midnight at the start of a day, for the countdown. Client only. */
export function localMidnight(k: DayKey): number {
  const [y, m, d] = parts(k);
  return new Date(y, m, d).getTime();
}

export function fmtDay(k: DayKey): string {
  const [y, m, d] = parts(k);
  return `${d} ${BULAN[m]} ${y}`;
}

export function fmtMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${BULAN_PANJANG[m - 1]} ${y}`;
}

export function fmtRange(a: DayKey | null, b: DayKey | null): string {
  if (!a) return NA;
  if (!b || b <= a) return fmtDay(a);
  const [ay, am, ad] = parts(a);
  const [by, bm, bd] = parts(b);
  if (ay === by && am === bm) return `${ad}–${bd} ${BULAN[am]} ${ay}`;
  if (ay === by) return `${ad} ${BULAN[am]} – ${fmtDay(b)}`;
  return `${fmtDay(a)} – ${fmtDay(b)}`;
}

/** "17 November 2026, 21.04 WIB" for an ISO datetime, or "17 Nov 2026" for a plain date. */
export function fmtUpdated(v: unknown): string | null {
  if (blank(v)) return null;
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s.trim())) return fmtDay(s.trim());
  const d = new Date(s);
  if (isNaN(d.getTime())) {
    const p = parseDay(s);
    return p ? fmtDay(p) : s;
  }
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => f.find((x) => x.type === t)?.value ?? "";
  return `${Number(get("day"))} ${BULAN_PANJANG[Number(get("month")) - 1]} ${get("year")}, ${get("hour")}.${get("minute")} WIB`;
}

/** Returns the URL only when it is an absolute http(s) URL. */
export function safeUrl(u: string): string | null {
  if (!/^https?:\/\//i.test(u)) return null;
  try {
    const x = new URL(u);
    return x.protocol === "http:" || x.protocol === "https:" ? x.href : null;
  } catch {
    return null;
  }
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalize(t: RawTournament, i: number): Tournament {
  const start = parseDay(t.start_date);
  const end = parseDay(t.end_date);
  const last = end && start && end >= start ? end : start;
  let sources = textList(t.source_urls);
  if (!sources.length && !blank(t.source_url)) sources = textList(t.source_url);
  const categories = textList(t.categories ?? t.divisions);
  const id = blank(t.id) ? `t${i}` : String(t.id);
  const name = text(t.name) ?? "(Tanpa nama)";
  const r = {
    venue: text(t.venue), organizer: text(t.organizer), fee: text(t.registration_fee),
    contact: text(t.contact), notes: text(t.notes),
  };
  const city = text(t.city) ?? "";
  const province = text(t.province) ?? "";
  return {
    id, name, start, end, last, city, province, ...r,
    deadline: parseDay(t.registration_deadline),
    deadlineText: text(t.registration_deadline),
    dateFound: parseDay(t.date_found),
    categories, sources,
    sample: t.sample === true,
    unconfirmed: String(t.status ?? "").toLowerCase() !== "confirmed",
    search: [name, city, province, r.venue, r.organizer, r.contact, r.notes, r.fee, ...categories]
      .filter(Boolean).join(" ").toLowerCase(),
    tone: hash(id) % 5,
  };
}

export function isPast(t: Tournament, today: DayKey): boolean {
  return t.last ? t.last < today : false;
}

export function isLive(t: Tournament, today: DayKey): boolean {
  return !!(t.start && t.last && t.start <= today && t.last >= today);
}

export function placeLine(t: Tournament): string {
  return [t.city, t.province].filter(Boolean).join(", ");
}

export function eventHref(t: Pick<Tournament, "id">): string {
  return `/turnamen/${encodeURIComponent(t.id)}`;
}

export function compareByStart(a: Tournament, b: Tournament): number {
  if (a.start !== b.start) {
    if (!a.start) return 1;
    if (!b.start) return -1;
    return a.start < b.start ? -1 : 1;
  }
  return a.name.localeCompare(b.name, "id");
}

/** The calendar grid for a "YYYY-MM": Monday-first weeks covering the whole month. */
export function monthGrid(month: string): { days: DayKey[]; first: DayKey; last: DayKey } {
  const [y, m] = month.split("-").map(Number);
  const first = toKey(y, m - 1, 1);
  const last = toKey(y, m, 0);
  const offset = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const cells = Math.ceil((offset + dayNumber(last)) / 7) * 7;
  const start = addDays(first, -offset);
  return { days: Array.from({ length: cells }, (_, i) => addDays(start, i)), first, last };
}

export function shiftMonth(month: string, n: number): string {
  const [y, m] = month.split("-").map(Number);
  return monthKey(toKey(y, m - 1 + n, 1));
}

/** sessionStorage key holding the list URL (with filters) for the detail page's back link. */
export const LIST_URL_KEY = "tm:list-url";

/** Route params may arrive percent-encoded; decode without throwing on stray "%". */
export function decodeParam(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
