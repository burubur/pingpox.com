import { Suspense } from "react";
import { TournamentBrowserStatic, TournamentBrowserWithParams } from "@/components/TournamentBrowser";
import { getSiteData } from "@/lib/data";
import { todayKey } from "@/lib/tournament";

export default function Home() {
  const { tournaments } = getSiteData();
  const props = {
    tournaments,
    buildDay: todayKey("Asia/Jakarta"),
    hasSample: tournaments.some((t) => t.sample),
  };
  // Static HTML carries the unfiltered list; the client then applies filters from the URL.
  return (
    <Suspense fallback={<TournamentBrowserStatic {...props} />}>
      <TournamentBrowserWithParams {...props} />
    </Suspense>
  );
}
