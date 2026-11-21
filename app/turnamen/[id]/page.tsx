import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import TournamentDetail from "@/components/TournamentDetail";
import { getSiteData, getTournament } from "@/lib/data";
import { decodeParam, fmtRange, placeLine, todayKey } from "@/lib/tournament";

type Params = { params: { id: string } };

/** Only ids in data/tournaments.json exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getSiteData().tournaments.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: Params): Metadata {
  const t = getTournament(decodeParam(params.id));
  if (!t) return {};
  const description = [
    t.start ? fmtRange(t.start, t.end) : "Tanggal belum diumumkan",
    placeLine(t) || null,
    t.categories.length ? t.categories.join(", ") : null,
    t.unconfirmed ? "Belum dikonfirmasi" : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const url = `/turnamen/${encodeURIComponent(t.id)}`;
  return {
    title: t.name,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: t.name, description, url },
    twitter: { card: "summary", title: t.name, description },
  };
}

export default function TournamentPage({ params }: Params) {
  const t = getTournament(decodeParam(params.id));
  if (!t) notFound();
  return (
    <>
      <BackLink />
      <TournamentDetail t={t} buildDay={todayKey("Asia/Jakarta")} />
    </>
  );
}
