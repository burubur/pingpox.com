import type { Metadata } from "next";
import { PlayerDirectory } from "@/components/PlayerDirectory";
import { getPlayers } from "@/lib/players";

const TITLE = "Pemain";
const DESCRIPTION = "Direktori pemain tenis meja di Indonesia. Data pemain segera hadir.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pemain" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/pemain" },
};

export default function PlayersPage() {
  return <PlayerDirectory players={getPlayers()} />;
}
