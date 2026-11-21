import type { Metadata } from "next";
import { EvaluateForm } from "@/features/evaluate/EvaluateForm";

export const metadata: Metadata = { title: "Evaluasi" };

export default function EvaluasiPage() {
  return (
    <>
      <div className="subbar">
        <div className="wrap">
          <h1>Evaluasi</h1>
        </div>
      </div>
      <EvaluateForm />
    </>
  );
}