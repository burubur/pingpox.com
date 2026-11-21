export type CourseSession = {
  order: number;
  durationHours: number;
  drills: string[];
};

export type CatalogTopic = {
  id: string;
  title: string;
};

export const OYUDA_SESSIONS: CourseSession[] = [
  {
    order: 1,
    durationHours: 2,
    drills: ["no-spin forehand", "right backspin forehand"],
  },
  {
    order: 2,
    durationHours: 2,
    drills: ["right backspin forehand", "left backspin forehand"],
  },
  {
    order: 3,
    durationHours: 2,
    drills: [
      "right backspin to forehand loop",
      "right topspin to forehand attack",
      "left topspin to backhand drive",
    ],
  },
  {
    order: 4,
    durationHours: 1.5,
    drills: ["expected return", "serve choice", "return position"],
  },
  {
    order: 5,
    durationHours: 2,
    drills: [
      "forehand short push",
      "backhand short push",
      "serve-push-attack patterns",
      "right chop to forehand loop",
    ],
  },
  {
    order: 6,
    durationHours: 2.5,
    drills: [
      "short push choices",
      "backhand drive into forehand loop",
      "backspin and no-spin replies",
      "topspin and chop block",
    ],
  },
  {
    order: 7,
    durationHours: 2,
    drills: ["long drive and attack pattern", "loop and attack pattern"],
  },
  {
    order: 8,
    durationHours: 2,
    drills: ["backhand and forehand loop", "short push", "forehand flick", "forehand attack"],
  },
  {
    order: 9,
    durationHours: 2,
    drills: [
      "long backhand drive into forehand attack",
      "heavy-spin serve",
      "long push",
      "forehand flip",
    ],
  },
  {
    order: 10,
    durationHours: 2,
    drills: ["short serve", "long push", "attack", "sparring"],
  },
  {
    order: 11,
    durationHours: 2,
    drills: ["foot body and hand correction against topspin and backspin"],
  },
  {
    order: 12,
    durationHours: 2,
    drills: [
      "forehand and backhand against topspin",
      "backhand against backspin",
    ],
  },
  {
    order: 13,
    durationHours: 2,
    drills: ["short and long placement on both sides"],
  },
  {
    order: 14,
    durationHours: 2,
    drills: [
      "long backspin",
      "forehand loop",
      "attack",
      "pendulum backhand flick",
      "forehand flick",
    ],
  },
];

export const CATALOG_TOPICS: CatalogTopic[] = [
  { id: "strategy", title: "Strategy" },
  { id: "tactics", title: "Tactics" },
  { id: "warm-up", title: "Warm-up" },
  { id: "serve", title: "Serve" },
  { id: "spin", title: "Spin" },
  { id: "smash", title: "Smash" },
  { id: "flick", title: "Flick" },
  { id: "loop", title: "Loop" },
  { id: "block", title: "Block" },
  { id: "footwork", title: "Footwork" },
  { id: "placement", title: "Placement" },
  { id: "game-strategy", title: "Game strategy" },
];

export function oyudaSessionCount(): number {
  return OYUDA_SESSIONS.length;
}
