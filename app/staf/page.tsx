import type { Metadata } from "next";
import { getCurrentAccount } from "@/lib/auth";
import { can } from "@/domain/roles";
import { listEvents, listEntries, listMatches } from "@/lib/queries/events";
import { StaffDrawClient } from "@/features/staff/StaffDrawClient";

export const metadata: Metadata = { title: "Staf acara" };
export const dynamic = "force-dynamic";

export default async function StafPage() {
  const account = await getCurrentAccount();
  if (!account || !can(account.role, "manageEvents")) {
    return (
      <div className="wrap intro">
        <p className="banner error">Hanya event manager atau superuser yang dapat mengakses halaman staf.</p>
      </div>
    );
  }

  const events = await listEvents();
  const tournament = events.find((e) => e.type === "tournament");
  const entries = tournament ? await listEntries(tournament.id) : [];
  const matches = tournament ? await listMatches(tournament.id) : [];

  return (
    <>
      <div className="subbar">
        <div className="wrap">
          <h1>Staf acara</h1>
        </div>
      </div>
      {tournament ? (
        <StaffDrawClient
          eventId={tournament.id}
          eventTitle={tournament.title}
          entries={entries.map((e) => ({
            id: e.id,
            name: e.player_name,
            status: e.status,
          }))}
          matches={matches.map((m) => ({
            id: m.id,
            label: `${m.stage}: ${m.player_a_name ?? "TBD"} vs ${m.player_b_name ?? "TBD"}`,
            scoreA: m.score_a,
            scoreB: m.score_b,
          }))}
        />
      ) : (
        <div className="wrap empty-state">
          <h3>Belum ada turnamen platform</h3>
          <p>Jalankan migrasi dan seed untuk mengisi data acara.</p>
        </div>
      )}
    </>
  );
}