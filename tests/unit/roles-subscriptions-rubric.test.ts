import { describe, expect, it } from "vitest";
import { can } from "@/domain/roles";
import {
  confirmEnrollment,
  createPendingEnrollment,
  declineEnrollment,
} from "@/domain/subscriptions";
import { evaluateWithRubric } from "@/domain/rubric";
import { OYUDA_SESSIONS, CATALOG_TOPICS, oyudaSessionCount } from "@/domain/curriculum";

describe("roles", () => {
  it("maps capabilities for all six roles", () => {
    expect(can("superuser", "manageRoles")).toBe(true);
    expect(can("event_manager", "buildDraw")).toBe(true);
    expect(can("trainer", "confirmSubscription")).toBe(true);
    expect(can("trainee", "requestCustomCourse")).toBe(true);
    expect(can("member", "enrollTraining")).toBe(true);
    expect(can("incognito", "enrollTraining")).toBe(false);
    expect(can(null, "browseCatalog")).toBe(true);
    expect(can("member", "buildDraw")).toBe(false);
  });
});

describe("subscriptions", () => {
  it("confirms monthly enrollment and promotes member to trainee", () => {
    const pending = createPendingEnrollment(
      "u1",
      { method: "monthly", courseShape: "oyuda" },
      "s1",
    );
    const result = confirmEnrollment(pending, "member", new Date("2026-01-01"));
    expect(result.subscription.status).toBe("active");
    expect(result.nextRole).toBe("trainee");
    expect(result.subscription.endsAt).toBeTruthy();
  });

  it("declines pending only", () => {
    const pending = createPendingEnrollment(
      "u1",
      { method: "one_time", courseShape: "custom" },
      "s2",
    );
    expect(declineEnrollment(pending).status).toBe("declined");
  });
});

describe("rubric and curriculum", () => {
  it("scores notes and requires next-step cue", () => {
    const report = evaluateWithRubric({
      kind: "training",
      notes: "Good loop but weak recovery. Next: short serve practice",
    });
    expect(report.source).toBe("rubric");
    expect(report.strengths.length).toBeGreaterThan(0);
    expect(report.nextSession.toLowerCase()).toContain("short serve");
  });

  it("seeds 14 Oyuda sessions and catalog topics", () => {
    expect(oyudaSessionCount()).toBe(14);
    expect(OYUDA_SESSIONS[0].durationHours).toBe(2);
    expect(CATALOG_TOPICS.map((t) => t.id)).toContain("serve");
  });

});
