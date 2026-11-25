import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticleView } from "@/components/NewsArticle";
import { getSiteData } from "@/lib/data";
import { getArticle, getNews, getNotice, scheduleNotices, storyFromArticle, storyFromNotice } from "@/lib/news";
import { decodeParam, todayKey } from "@/lib/tournament";

type Params = { params: { slug: string } };

/** Editorial slugs and schedule notices are prebuilt. Any other slug is a 404. */
export function generateStaticParams() {
  const today = todayKey("Asia/Jakarta");
  const notices = scheduleNotices(getSiteData().tournaments, today);
  return [...getNews().map((article) => article.slug), ...notices.map((notice) => notice.slug)].map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: Params): Metadata {
  const slug = decodeParam(params.slug);
  const article = getArticle(slug);
  const notice = article ? undefined : getNotice(getSiteData().tournaments, todayKey("Asia/Jakarta"), slug);
  const title = article?.title ?? notice?.title;
  if (!title) return {};
  const description = article?.summary ?? (notice ? `${notice.when}${notice.city ? ` · ${notice.city}` : ""}` : "Berita PingpoX.");
  const url = `/berita/${encodeURIComponent(slug)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default function NewsArticlePage({ params }: Params) {
  const slug = decodeParam(params.slug);
  const article = getArticle(slug);
  if (article) return <NewsArticleView story={storyFromArticle(article)} />;
  const notice = getNotice(getSiteData().tournaments, todayKey("Asia/Jakarta"), slug);
  if (!notice) notFound();
  return <NewsArticleView story={storyFromNotice(notice)} />;
}
