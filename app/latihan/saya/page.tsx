import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/auth";
import { can } from "@/domain/roles";
import {
  getProgress,
  getUserSubscriptions,
  listCatalogTopics,
  listOyudaSessions,
} from "@/lib/queries/training";
import { CustomRequestForm } from "@/features/training/CustomRequestForm";

export const metadata: Metadata = { title: "Latihan saya" };
export const dynamic = "force-dynamic";

export default async function LatihanSayaPage() {
  const account = await getCurrentAccount();
  if (!account || !can(account.role, "viewOwnTraining") || account.role === "incognito") {
    redirect("/masuk");
  }
  if (account.role === "member") {
    redirect("/latihan");
  }

  const [subs, sessions, progress, topics] = await Promise.all([
    getUserSubscriptions(account.id),
    listOyudaSessions(),
    getProgress(account.id, "oyuda"),
    listCatalogTopics(),
  ]);
  const active = subs.find((s) => s.status === "active");
  const pending = subs.find((s) => s.status === "pending");

  return (
    <>
      <div className="subbar">
        <div className="wrap">
          <h1>Latihan saya</h1>
        </div>
      </div>
      <div className="wrap list">
        {pending ? <p className="banner">Pendaftaran menunggu konfirmasi pelatih.</p> : null}
        {active ? (
          <p className="meta">
            {active.method} · {active.course_shape}
            {active.starts_at ? ` · ${new Date(active.starts_at).toLocaleDateString("id-ID")}` : ""}
            {active.ends_at ? ` → ${new Date(active.ends_at).toLocaleDateString("id-ID")}` : ""}
          </p>
        ) : null}
        <ol className="agenda">
          {sessions.map((s) => {
            const done = progress.find((p) => p.session_order === s.order)?.done;
            return (
              <li key={s.order} className="ag" style={{ listStyle: "none" }}>
                <div className="d">
                  <b>{s.order}</b>
                  <span>{done ? "selesai" : "rencana"}</span>
                </div>
                <div>
                  <h3>
                    Sesi {s.order} · {s.durationHours} jam
                  </h3>
                  <p>{s.drills.join("; ")}</p>
                </div>
              </li>
            );
          })}
        </ol>
        {active && account.role === "trainee" ? (
          <CustomRequestForm subscriptionId={active.id} topics={topics} />
        ) : null}
      </div>
    </>
  );
}