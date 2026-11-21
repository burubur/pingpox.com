import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/auth";
import { can } from "@/domain/roles";
import { listCustomRequests, listSubscriptions } from "@/lib/queries/training";
import { TrainerDeskClient } from "@/features/training/TrainerDeskClient";

export const metadata: Metadata = { title: "Meja pelatih" };
export const dynamic = "force-dynamic";

export default async function LatihanMejaPage() {
  const account = await getCurrentAccount();
  if (!account) redirect("/masuk");
  if (!can(account.role, "confirmSubscription")) {
    return (
      <div className="wrap intro">
        <p className="banner error">Hanya pelatih atau superuser yang dapat mengakses meja ini.</p>
      </div>
    );
  }

  const [pendingSubs, customRequests] = await Promise.all([
    listSubscriptions("pending"),
    listCustomRequests("pending"),
  ]);

  return (
    <>
      <div className="subbar">
        <div className="wrap">
          <h1>Meja pelatih</h1>
        </div>
      </div>
      <TrainerDeskClient
        pendingSubs={pendingSubs.map((s) => ({
          id: s.id,
          name: s.display_name,
          method: s.method,
          courseShape: s.course_shape,
        }))}
        customRequests={customRequests.map((r) => ({
          id: r.id,
          name: r.display_name,
          goal: r.goal,
          sessionCount: r.session_count,
          topicIds: JSON.parse(r.topic_ids) as string[],
        }))}
      />
    </>
  );
}