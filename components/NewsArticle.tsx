"use client";

import Link from "next/link";
import { useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { NewsStory } from "@/lib/news";
import { useToday } from "@/lib/use-today";
import { fmtDay, type DayKey } from "@/lib/tournament";

const TABS = [
  { id: "isi", label: "Isi" },
  { id: "sumber", label: "Sumber" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function NewsArticleView({
  story,
  buildDay,
  start,
  last,
}: {
  story: NewsStory;
  buildDay: DayKey;
  start: DayKey | null;
  last: DayKey | null;
}) {
  const [tab, setTab] = useState<TabId>("isi");
  const today = useToday(buildDay);
  const kicker = start && last ? (start <= today && last >= today ? "Berlangsung" : "Pengumuman jadwal") : story.kicker;

  const onTabKey = (e: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    const id = TABS[next].id;
    setTab(id);
    const el = document.getElementById(`tab-${id}`);
    if (el instanceof HTMLButtonElement) el.focus();
  };

  return (
    <>
      <div className="backbar">
        <div className="wrap">
          <Link href="/berita">‹ Daftar berita</Link>
        </div>
      </div>
      <header className="hero player-hero">
        <div className="band">
          <p className="lbl">{kicker}</p>
          <h1>{story.title}</h1>
          <p className="player-meta">
            {story.published ? fmtDay(story.published) : "Tanggal belum diisi"}
            {story.city ? ` · ${story.city}` : ""}
            {story.when ? ` · ${story.when}` : ""}
          </p>
        </div>
      </header>
      <div className="tabs">
        <div className="wrap" role="tablist" aria-label="Bagian berita">
          {TABS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={item.id}
              tabIndex={tab === item.id ? 0 : -1}
              className={tab === item.id ? "on" : undefined}
              onClick={() => setTab(item.id)}
              onKeyDown={(e) => onTabKey(e, index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <main className="wrap detail-end">
        <div id="isi" role="tabpanel" aria-labelledby="tab-isi" hidden={tab !== "isi"}>
          {story.paragraphs.length === 0 ? (
            <div className="empty-state">
              <h2>Isi belum tersedia</h2>
              <p>Artikel ini belum memiliki teks.</p>
            </div>
          ) : (
            <div className="news-body">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {story.eventHref ? (
                <p>
                  <Link href={story.eventHref}>Lihat di jadwal</Link>
                </p>
              ) : null}
            </div>
          )}
        </div>
        <div id="sumber" role="tabpanel" aria-labelledby="tab-sumber" hidden={tab !== "sumber"}>
          {story.source ? (
            <p className="news-source">
              <a href={story.source} rel="noreferrer">
                {story.source}
              </a>
            </p>
          ) : (
            <div className="empty-state">
              <h2>Belum ada tautan sumber</h2>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
