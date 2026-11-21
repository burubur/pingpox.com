import { sql, sqlOne } from "@/lib/db";
import { newId } from "@/lib/id";
import {
  advanceToElimination,
  buildEliminationMatches,
  buildRoundRobin,
  snakeSeedGroups,
  type StandingRow,
} from "@/domain/draw";

export type EventType = "exhibition" | "tournament" | "basecamp";
export type EventStatus =
  | "draft"
  | "open"
  | "qualification"
  | "elimination"
  | "completed";

export type EventRecord = {
  id: string;
  type: EventType;
  title: string;
  summary: string;
  place: string;
  capacity: number;
  registrationOpens: string;
  registrationCloses: string;
  status: EventStatus;
  durationWeeks: number | null;
  startDate: string | null;
  groupSize: number;
  advanceCount: number;
};

type EventRow = {
  id: string;
  type: EventType;
  title: string;
  summary: string;
  place: string;
  capacity: number;
  registration_opens: string;
  registration_closes: string;
  status: EventStatus;
  duration_weeks: number | null;
  start_date: string | null;
  group_size: number | null;
  advance_count: number | null;
};

function mapEvent(row: EventRow): EventRecord {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    summary: row.summary,
    place: row.place,
    capacity: row.capacity,
    registrationOpens: row.registration_opens,
    registrationCloses: row.registration_closes,
    status: row.status,
    durationWeeks: row.duration_weeks,
    startDate: row.start_date,
    groupSize: row.group_size ?? 4,
    advanceCount: row.advance_count ?? 2,
  };
}

export async function listEvents(filters?: {
  type?: EventType;
  status?: EventStatus;
}): Promise<EventRecord[]> {
  const rows = await sql<EventRow>(
    `select * from events order by created_at desc`,
  );
  return rows
    .map(mapEvent)
    .filter((e) => (filters?.type ? e.type === filters.type : true))
    .filter((e) => (filters?.status ? e.status === filters.status : true));
}

export async function getEvent(id: string): Promise<EventRecord | null> {
  const row = await sqlOne<EventRow>(`select * from events where id = $1`, [id]);
  return row ? mapEvent(row) : null;
}

export async function createEvent(input: {
  type: EventType;
  title: string;
  summary: string;
  place: string;
  capacity: number;
  registrationOpens: string;
  registrationCloses: string;
  durationWeeks?: number;
  startDate?: string;
  groupSize?: number;
  advanceCount?: number;
}): Promise<EventRecord> {
  const id = newId("ev");
  await sql(
    `insert into events (id, type, title, summary, place, capacity, registration_opens, registration_closes, status, duration_weeks, start_date, group_size, advance_count)
     values ($1,$2,$3,$4,$5,$6,$7,$8,'open',$9,$10,$11,$12)`,
    [
      id,
      input.type,
      input.title,
      input.summary,
      input.place,
      input.capacity,
      input.registrationOpens,
      input.registrationCloses,
      input.durationWeeks ?? null,
      input.startDate ?? null,
      input.groupSize ?? 4,
      input.advanceCount ?? 2,
    ],
  );

  if (input.type === "basecamp" && input.durationWeeks && input.startDate) {
    const days = input.durationWeeks * 7;
    for (let i = 1; i <= days; i++) {
      await sql(
        `insert into event_sessions (id, event_id, day_index, title, notes) values ($1,$2,$3,$4,$5)`,
        [newId("es"), id, i, `Day ${i}`, null],
      );
    }
  }

  return (await getEvent(id))!;
}

export async function updateEventStatus(
  id: string,
  status: EventStatus,
): Promise<void> {
  await sql(`update events set status = $1 where id = $2`, [status, id]);
}

export async function listEntries(eventId: string) {
  return sql<{
    id: string;
    player_id: string;
    player_name: string;
    ranking: number;
    status: string;
    seed_order: number | null;
  }>(
    `select e.id, e.player_id, p.name as player_name, p.ranking, e.status, e.seed_order
     from entries e join players p on p.id = e.player_id
     where e.event_id = $1
     order by coalesce(e.seed_order, 9999), p.ranking`,
    [eventId],
  );
}

export async function registerPlayer(
  eventId: string,
  playerId: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const event = await getEvent(eventId);
  if (!event) return { ok: false, reason: "Event not found" };
  if (event.status !== "open") {
    return { ok: false, reason: "Registration is closed for this event" };
  }
  const now = new Date();
  if (now < new Date(event.registrationOpens) || now > new Date(event.registrationCloses)) {
    return { ok: false, reason: "Outside the registration window" };
  }
  const entries = await listEntries(eventId);
  const confirmed = entries.filter((e) => e.status === "confirmed" || e.status === "pending");
  if (confirmed.length >= event.capacity) {
    return { ok: false, reason: "Event is full" };
  }
  if (entries.some((e) => e.player_id === playerId)) {
    return { ok: false, reason: "Player already registered" };
  }
  await sql(
    `insert into entries (id, event_id, player_id, status, seed_order) values ($1,$2,$3,'pending',$4)`,
    [newId("en"), eventId, playerId, confirmed.length + 1],
  );
  return { ok: true };
}

export async function setEntryStatus(
  entryId: string,
  status: "pending" | "confirmed" | "withdrawn",
): Promise<void> {
  await sql(`update entries set status = $1 where id = $2`, [status, entryId]);
}

export async function listGroups(eventId: string) {
  return sql<{
    group_index: number;
    player_id: string;
    player_name: string;
    seed_in_group: number;
  }>(
    `select g.group_index, g.player_id, p.name as player_name, g.seed_in_group
     from event_groups g join players p on p.id = g.player_id
     where g.event_id = $1
     order by g.group_index, g.seed_in_group`,
    [eventId],
  );
}

export async function listMatches(eventId: string) {
  return sql<{
    id: string;
    stage: string;
    group_index: number | null;
    round: number | null;
    slot: number | null;
    player_a_id: string | null;
    player_b_id: string | null;
    player_a_name: string | null;
    player_b_name: string | null;
    score_a: number | null;
    score_b: number | null;
    winner_id: string | null;
    is_bye: boolean;
  }>(
    `select m.*, pa.name as player_a_name, pb.name as player_b_name
     from matches m
     left join players pa on pa.id = m.player_a_id
     left join players pb on pb.id = m.player_b_id
     where m.event_id = $1
     order by m.stage, coalesce(m.group_index,0), coalesce(m.round,0), coalesce(m.slot,0)`,
    [eventId],
  );
}

export async function listEventSessions(eventId: string) {
  return sql<{ id: string; day_index: number; title: string; notes: string | null }>(
    `select id, day_index, title, notes from event_sessions where event_id = $1 order by day_index`,
    [eventId],
  );
}

export async function buildQualification(eventId: string): Promise<void> {
  const event = await getEvent(eventId);
  if (!event || event.type !== "tournament") throw new Error("Not a tournament");
  const entries = (await listEntries(eventId)).filter((e) => e.status === "confirmed");
  if (entries.length < 2) throw new Error("Need at least 2 confirmed players");

  await sql(`delete from matches where event_id = $1 and stage = 'qualification'`, [eventId]);
  await sql(`delete from event_groups where event_id = $1`, [eventId]);

  const seeded = entries.map((e) => ({ id: e.player_id, ranking: e.ranking }));
  const groups = snakeSeedGroups(seeded, event.groupSize);
  for (const g of groups) {
    await sql(
      `insert into event_groups (id, event_id, group_index, player_id, seed_in_group) values ($1,$2,$3,$4,$5)`,
      [newId("g"), eventId, g.groupIndex, g.playerId, g.seedInGroup],
    );
  }
  const matches = buildRoundRobin(groups);
  for (const m of matches) {
    await sql(
      `insert into matches (id, event_id, stage, group_index, round, slot, player_a_id, player_b_id, is_bye)
       values ($1,$2,'qualification',$3,$4,0,$5,$6,false)`,
      [newId("m"), eventId, m.groupIndex, m.round, m.playerAId, m.playerBId],
    );
  }
  await updateEventStatus(eventId, "qualification");
}

export async function recordMatchScore(
  matchId: string,
  scoreA: number,
  scoreB: number,
): Promise<void> {
  const match = await sqlOne<{
    player_a_id: string;
    player_b_id: string;
    stage: string;
    event_id: string;
    round: number | null;
    slot: number | null;
  }>(`select * from matches where id = $1`, [matchId]);
  if (!match) throw new Error("Match not found");
  const winnerId = scoreA > scoreB ? match.player_a_id : match.player_b_id;
  await sql(
    `update matches set score_a=$1, score_b=$2, winner_id=$3 where id=$4`,
    [scoreA, scoreB, winnerId, matchId],
  );

  if (match.stage === "elimination" && match.round != null && match.slot != null) {
    const nextRound = match.round + 1;
    const nextSlot = Math.floor(match.slot / 2);
    const existing = await sqlOne<{ id: string; player_a_id: string | null; player_b_id: string | null }>(
      `select id, player_a_id, player_b_id from matches
       where event_id=$1 and stage='elimination' and round=$2 and slot=$3`,
      [match.event_id, nextRound, nextSlot],
    );
    const isA = match.slot % 2 === 0;
    if (existing) {
      if (isA) {
        await sql(`update matches set player_a_id=$1 where id=$2`, [winnerId, existing.id]);
      } else {
        await sql(`update matches set player_b_id=$1 where id=$2`, [winnerId, existing.id]);
      }
    } else {
      await sql(
        `insert into matches (id, event_id, stage, round, slot, player_a_id, player_b_id, is_bye)
         values ($1,$2,'elimination',$3,$4,$5,$6,false)`,
        [
          newId("m"),
          match.event_id,
          nextRound,
          nextSlot,
          isA ? winnerId : null,
          isA ? null : winnerId,
        ],
      );
    }
  }
}

export async function advanceEventToElimination(eventId: string): Promise<void> {
  const event = await getEvent(eventId);
  if (!event) throw new Error("Event not found");
  const groups = await listGroups(eventId);
  const matches = (await listMatches(eventId)).filter((m) => m.stage === "qualification");
  const groupIndexes = Array.from(new Set(groups.map((g) => g.group_index)));
  const groupStandings: StandingRow[][] = [];
  const rankings = new Map<string, number>();

  for (const gi of groupIndexes) {
    const members = groups.filter((g) => g.group_index === gi);
    const standings: StandingRow[] = members.map((m) => {
      rankings.set(m.player_id, 0);
      return {
        playerId: m.player_id,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
      };
    });
    for (const m of matches.filter((x) => x.group_index === gi && x.winner_id)) {
      const winner = standings.find((s) => s.playerId === m.winner_id);
      const loserId =
        m.winner_id === m.player_a_id ? m.player_b_id : m.player_a_id;
      const loser = standings.find((s) => s.playerId === loserId);
      if (winner) {
        winner.wins += 1;
        winner.pointsFor += m.score_a ?? 0;
        winner.pointsAgainst += m.score_b ?? 0;
      }
      if (loser) {
        loser.losses += 1;
        loser.pointsFor += m.score_b ?? 0;
        loser.pointsAgainst += m.score_a ?? 0;
      }
    }
    groupStandings.push(standings);
  }

  const entries = await listEntries(eventId);
  for (const e of entries) rankings.set(e.player_id, e.ranking);

  await sql(`delete from matches where event_id = $1 and stage = 'elimination'`, [eventId]);
  const slots = advanceToElimination(groupStandings, event.advanceCount, rankings);
  const elimMatches = buildEliminationMatches(slots);
  for (const m of elimMatches) {
    await sql(
      `insert into matches (id, event_id, stage, round, slot, player_a_id, player_b_id, is_bye)
       values ($1,$2,'elimination',$3,$4,$5,$6,$7)`,
      [newId("m"), eventId, m.round, m.slot, m.playerAId, m.playerBId, m.isBye],
    );
  }
  await updateEventStatus(eventId, "elimination");
}

export async function addExhibitionMatch(
  eventId: string,
  playerAId: string,
  playerBId: string,
): Promise<void> {
  await sql(
    `insert into matches (id, event_id, stage, round, slot, player_a_id, player_b_id, is_bye)
     values ($1,$2,'exhibition',1,0,$3,$4,false)`,
    [newId("m"), eventId, playerAId, playerBId],
  );
}
