import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerProfile } from "@/components/PlayerProfile";
import { genderLabel } from "@/lib/player";
import { getPlayer, getPlayers } from "@/lib/players";
import { decodeParam } from "@/lib/tournament";

type Params = { params: { id: string } };

/** Ids in data/players.json are prebuilt. Any other id renders the player 404. */
export function generateStaticParams() {
  return getPlayers().map((player) => ({ id: player.id }));
}

export function generateMetadata({ params }: Params): Metadata {
  const player = getPlayer(decodeParam(params.id));
  if (!player) return {};
  const description = [genderLabel(player.gender), player.province, player.category].filter(Boolean).join(" · ")
    || "Profil pemain tenis meja.";
  const url = `/pemain/${encodeURIComponent(player.id)}`;
  return {
    title: player.name,
    description,
    alternates: { canonical: url },
    openGraph: { title: player.name, description, url },
  };
}

export default function PlayerPage({ params }: Params) {
  const player = getPlayer(decodeParam(params.id));
  if (!player) notFound();
  return <PlayerProfile player={player} />;
}
