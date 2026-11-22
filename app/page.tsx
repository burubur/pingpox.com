import { Suspense } from "react";
import { HomeHero } from "@/components/HomeHero";
import { TournamentBrowserStatic, TournamentBrowserWithParams } from "@/components/TournamentBrowser";
import { chromeCandidates } from "@/lib/chrome";
import { getSiteData } from "@/lib/data";
import { todayKey } from "@/lib/tournament";

export default function Home() {
  const { tournaments } = getSiteData();
  const buildDay = todayKey("Asia/Jakarta");
  const props = {
    tournaments,
    buildDay,
    hasSample: tournaments.some((t) => t.sample),
  };
  // Static HTML carries the unfiltered list; the client then applies filters from the URL.
  return (
    <>
      <HomeHero events={chromeCandidates(tournaments)} buildDay={buildDay} total={tournaments.length} />
      <Suspense fallback={<TournamentBrowserStatic {...props} />}>
        <TournamentBrowserWithParams {...props} />
      </Suspense>
    </>
  );
}
