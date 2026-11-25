"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NewsArticle, ScheduleNotice } from "@/lib/news";
import { fmtDay, todayKey, type DayKey } from "@/lib/tournament";

/** Keep Berlangsung / Mendatang on the visitor's Jakarta date after the static HTML is built. */
function useJakartaToday(initial: DayKey): DayKey {
  const [today, setToday] = useState(initial);
  useEffect(() => {
    const update = () => setToday(todayKey("Asia/Jakarta"));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return today;
}

function visibleNotices(notices: ScheduleNotice[], today: DayKey): ScheduleNotice[] {
  return notices
    .filter((notice) => notice.last >= today)
    .map((notice) => ({ ...notice, live: notice.start <= today && notice.last >= today }));
}

function DateMark({ day }: { day: string | null }) {
  if (!day) {
    return (
      <div className="hub-date">
        <b>—</b>
        <span>Tanggal</span>
      </div>
    );
  }
  const [, month, date] = day.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return (
    <div className="hub-date">
      <b>{Number(date)}</b>
      <span>{months[Number(month) - 1]}</span>
      <small>{day.slice(0, 4)}</small>
    </div>
  );
}

export function NewsList({
  articles,
  notices,
  buildDay,
}: {
  articles: NewsArticle[];
  notices: ScheduleNotice[];
  buildDay: DayKey;
}) {
  const today = useJakartaToday(buildDay);
  const shown = visibleNotices(notices, today);
  return (
    <div className="hub" id="berita">
      <div className="hub-head">
        <div className="wrap hub-head-row">
          <div>
            <p className="lbl">Kabar</p>
            <h1 className="page-title">Berita</h1>
          </div>
          <p className="hub-count">{articles.length === 0 ? "Belum ada berita" : `${articles.length} berita`}</p>
        </div>
      </div>
      <main className="wrap hub-main">
        {articles.length === 0 ? (
          <div className="empty-state">
            <div className="big" aria-hidden="true">🏓</div>
            <h2>Belum ada berita</h2>
            <p>
              {shown.length === 0
                ? "Daftar berita masih kosong, dan belum ada turnamen mendatang di jadwal."
                : "Daftar berita masih kosong. Kartu di bawah hanya mengulang turnamen mendatang dari jadwal, bukan liputan."}
            </p>
          </div>
        ) : (
          <ul className="hub-list news-list">
            {articles.map((article) => (
              <li key={article.slug}>
                <article className="hub-card">
                  <DateMark day={article.published} />
                  <div className="hub-body">
                    <p className="lbl">Berita</p>
                    <h2>
                      <Link className="hub-name" href={`/berita/${encodeURIComponent(article.slug)}`}>
                        {article.title}
                      </Link>
                    </h2>
                    {article.summary ? <p className="hub-when">{article.summary}</p> : null}
                    {article.published ? <p className="hub-where">{fmtDay(article.published)}</p> : null}
                    <span className="hub-go">Baca</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
        {shown.length > 0 ? (
          <section className="news-notices" aria-labelledby="pengumuman-jadwal">
            <h2 id="pengumuman-jadwal">Pengumuman jadwal</h2>
            <ul className="hub-list news-list">
              {shown.map((notice) => (
                <li key={notice.slug}>
                  <article className="hub-card">
                    <DateMark day={notice.published} />
                    <div className="hub-body">
                      <p className="lbl">{notice.live ? "Berlangsung" : "Mendatang"}</p>
                      <h3>
                        <Link className="hub-name" href={`/berita/${encodeURIComponent(notice.slug)}`}>
                          {notice.title}
                        </Link>
                      </h3>
                      <p className="hub-where">{notice.city ?? "Kota belum diumumkan"}</p>
                      <p className="hub-when">{notice.when}</p>
                      <span className="hub-go">Baca pengumuman</span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}
