import type { Metadata } from "next";
import { NewsList } from "@/components/NewsList";
import { getNews, scheduleNotices } from "@/lib/news";
import { getSiteData } from "@/lib/data";
import { todayKey } from "@/lib/tournament";

const TITLE = "Berita";
const DESCRIPTION = "Berita tenis meja di Indonesia. Daftar berita masih kosong.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/berita" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/berita" },
};

export default function NewsPage() {
  const today = todayKey("Asia/Jakarta");
  return (
    <NewsList articles={getNews()} notices={scheduleNotices(getSiteData().tournaments, today)} buildDay={today} />
  );
}
