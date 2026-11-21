import type { Metadata } from "next";
import { listPlayers } from "@/lib/queries/players";
import { PlayerList } from "@/features/players/PlayerList";

export const metadata: Metadata = {
  title: "Pemain",
};

export const dynamic = "force-dynamic";

export default async function PemainPage() {
  const players = await listPlayers();
  return (
    <>
      <div className="subbar">
        <div className="wrap">
          <h1>Pemain</h1>
        </div>
      </div>
      <PlayerList players={players} />
    </>
  );
}