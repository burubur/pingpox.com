import fs from "node:fs";
import path from "node:path";
import {
  compareByStart,
  eventHref,
  fmtRange,
  parseDay,
  safeUrl,
  type DayKey,
  type Tournament,
} from "./tournament";

/** Editorial news. Empty until a later, separately approved data update. */
export const NEWS_FILE = path.join(process.cwd(), "data", "news.json");

export type NewsArticle = {
  slug: string;
  title: string;
  published: DayKey | null;
  summary: string | null;
  paragraphs: string[];
  source: string | null;
};

/** A schedule card built only from a tournaments.json row. Not stored as news. */
export type ScheduleNotice = {
  slug: string;
  title: string;
  published: DayKey | null;
  when: string;
  city: string | null;
  source: string | null;
  eventHref: string;
  live: boolean;
};

function str(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function paragraphs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(str).filter((row): row is string => !!row);
}

function normalize(raw: object): NewsArticle | null {
  const row = raw as Record<string, unknown>;
  const slug = str(row.slug);
  const title = str(row.title);
  if (!slug || !title) return null;
  const source = str(row.source);
  return {
    slug,
    title,
    published: parseDay(row.published),
    summary: str(row.summary),
    paragraphs: paragraphs(row.paragraphs),
    source: source ? safeUrl(source) : null,
  };
}

let cache: NewsArticle[] | null = null;

/** Reads data/news.json. A non-array file fails the build. Contact fields are never read. */
export function getNews(): NewsArticle[] {
  if (cache) return cache;
  const raw: unknown = JSON.parse(fs.readFileSync(NEWS_FILE, "utf8"));
  if (!Array.isArray(raw)) {
    throw new Error(`${NEWS_FILE}: harus berupa array.`);
  }
  const seen = new Set<string>();
  cache = raw
    .filter((row): row is object => !!row && typeof row === "object" && !Array.isArray(row))
    .map(normalize)
    .filter((article): article is NewsArticle => {
      if (!article || seen.has(article.slug)) return false;
      seen.add(article.slug);
      return true;
    })
    .sort((a, b) => {
      if (a.published !== b.published) {
        if (!a.published) return 1;
        if (!b.published) return -1;
        return a.published < b.published ? 1 : -1;
      }
      return a.title.localeCompare(b.title, "id");
    });
  return cache;
}

export function getArticle(slug: string): NewsArticle | undefined {
  return getNews().find((article) => article.slug === slug);
}

export function noticeSlug(id: string): string {
  return `jadwal-${id}`;
}

/**
 * One card per upcoming public tournament. Uses name, dates, city, and the
 * first http(s) source only. Past and sample rows are omitted.
 */
export function scheduleNotices(tournaments: Tournament[], today: DayKey): ScheduleNotice[] {
  const taken = new Set(getNews().map((article) => article.slug));
  return tournaments
    .filter((t) => !t.sample && t.start && t.last && t.last >= today)
    .sort(compareByStart)
    .map((t) => {
      const source = t.sources.map(safeUrl).find((url): url is string => !!url) ?? null;
      return {
        slug: noticeSlug(t.id),
        title: t.name,
        published: t.start,
        when: fmtRange(t.start, t.end),
        city: t.city.trim() ? t.city.trim() : null,
        source,
        eventHref: eventHref(t),
        live: t.start! <= today && t.last! >= today,
      };
    })
    .filter((notice) => !taken.has(notice.slug));
}

export function getNotice(tournaments: Tournament[], today: DayKey, slug: string): ScheduleNotice | undefined {
  return scheduleNotices(tournaments, today).find((notice) => notice.slug === slug);
}

export type NewsStory = {
  kind: "berita" | "jadwal";
  title: string;
  published: DayKey | null;
  kicker: string;
  paragraphs: string[];
  source: string | null;
  eventHref: string | null;
  city: string | null;
  when: string | null;
};

export function storyFromArticle(article: NewsArticle): NewsStory {
  return {
    kind: "berita",
    title: article.title,
    published: article.published,
    kicker: "Berita",
    paragraphs: article.paragraphs.length ? article.paragraphs : article.summary ? [article.summary] : [],
    source: article.source,
    eventHref: null,
    city: null,
    when: null,
  };
}

export function storyFromNotice(notice: ScheduleNotice): NewsStory {
  const city = notice.city ?? "belum diumumkan";
  return {
    kind: "jadwal",
    title: notice.title,
    published: notice.published,
    kicker: notice.live ? "Berlangsung" : "Pengumuman jadwal",
    paragraphs: [
      `${notice.title} tercatat di jadwal PingpoX.`,
      `Tanggal: ${notice.when}.`,
      `Kota: ${city}.`,
    ],
    source: notice.source,
    eventHref: notice.eventHref,
    city: notice.city,
    when: notice.when,
  };
}
