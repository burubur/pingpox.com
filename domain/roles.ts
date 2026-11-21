export type Role =
  | "superuser"
  | "event_manager"
  | "trainer"
  | "trainee"
  | "member"
  | "incognito";

export type Capability =
  | "manageRoles"
  | "editCurriculum"
  | "editPrices"
  | "confirmSubscription"
  | "acceptCustomCourse"
  | "markSessionDone"
  | "writeEvaluation"
  | "buildDraw"
  | "manageEvents"
  | "managePlayers"
  | "enrollTraining"
  | "requestCustomCourse"
  | "viewOwnTraining"
  | "registerForEvent"
  | "browseCatalog";

const CAPABILITIES: Record<Capability, readonly Role[]> = {
  manageRoles: ["superuser"],
  editCurriculum: ["superuser"],
  editPrices: ["superuser"],
  confirmSubscription: ["superuser", "trainer"],
  acceptCustomCourse: ["superuser", "trainer"],
  markSessionDone: ["superuser", "trainer"],
  writeEvaluation: ["superuser", "trainer"],
  buildDraw: ["superuser", "event_manager"],
  manageEvents: ["superuser", "event_manager"],
  managePlayers: ["superuser", "event_manager"],
  enrollTraining: ["member", "trainee"],
  requestCustomCourse: ["trainee"],
  viewOwnTraining: ["trainee", "trainer", "superuser"],
  registerForEvent: ["incognito", "member", "trainee", "trainer", "event_manager", "superuser"],
  browseCatalog: ["incognito", "member", "trainee", "trainer", "event_manager", "superuser"],
};

export function can(role: Role | null | undefined, capability: Capability): boolean {
  const resolved: Role = role ?? "incognito";
  return CAPABILITIES[capability].includes(resolved);
}

export function assertCan(
  role: Role | null | undefined,
  capability: Capability,
): void {
  if (!can(role, capability)) {
    throw new Error(`Role ${role ?? "incognito"} cannot ${capability}`);
  }
}

export function roleAfterEnrollmentConfirmed(current: Role): Role {
  if (current === "member" || current === "trainee") {
    return "trainee";
  }
  return current;
}
