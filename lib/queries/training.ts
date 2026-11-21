import { sql, sqlOne } from "@/lib/db";
import { newId } from "@/lib/id";
import {
  completeOneTimeWhenSessionsDone,
  confirmEnrollment,
  createPendingEnrollment,
  declineEnrollment,
  type CourseShape,
  type SubscriptionMethod,
} from "@/domain/subscriptions";
import { updateAccountRole } from "@/lib/auth";
import type { Role } from "@/domain/roles";

export async function getPrices(): Promise<{ monthly: number; oneTime: number }> {
  const rows = await sql<{ key: string; value: string }>(
    `select key, value from settings where key in ('price_monthly','price_one_time')`,
  );
  const map = Object.fromEntries(rows.map((r) => [r.key, Number(r.value)]));
  return {
    monthly: map.price_monthly ?? 450000,
    oneTime: map.price_one_time ?? 1500000,
  };
}

export async function setPrice(key: "price_monthly" | "price_one_time", value: number) {
  await sql(`update settings set value = $1 where key = $2`, [String(value), key]);
}

export async function listOyudaSessions() {
  const rows = await sql<{
    session_order: number;
    duration_hours: string;
    drills: string;
  }>(
    `select session_order, duration_hours, drills from course_sessions where course_key='oyuda' order by session_order`,
  );
  return rows.map((r) => ({
    order: r.session_order,
    durationHours: Number(r.duration_hours),
    drills: JSON.parse(r.drills) as string[],
  }));
}

export async function listCatalogTopics() {
  return sql<{ id: string; title: string }>(
    `select id, title from catalog_topics order by title`,
  );
}

export async function enroll(
  userId: string,
  method: SubscriptionMethod,
  courseShape: CourseShape,
) {
  const id = newId("sub");
  const pending = createPendingEnrollment(userId, { method, courseShape }, id);
  await sql(
    `insert into subscriptions (id, user_id, method, course_shape, status) values ($1,$2,$3,$4,$5)`,
    [pending.id, pending.userId, pending.method, pending.courseShape, pending.status],
  );
  return pending;
}

export async function listSubscriptions(status?: string) {
  if (status) {
    return sql<{
      id: string;
      user_id: string;
      display_name: string;
      email: string;
      method: SubscriptionMethod;
      course_shape: CourseShape;
      status: string;
      starts_at: string | null;
      ends_at: string | null;
    }>(
      `select s.*, a.display_name, a.email
       from subscriptions s join accounts a on a.id = s.user_id
       where s.status = $1
       order by s.created_at desc`,
      [status],
    );
  }
  return sql<{
    id: string;
    user_id: string;
    display_name: string;
    email: string;
    method: SubscriptionMethod;
    course_shape: CourseShape;
    status: string;
    starts_at: string | null;
    ends_at: string | null;
  }>(
    `select s.*, a.display_name, a.email
     from subscriptions s join accounts a on a.id = s.user_id
     order by s.created_at desc`,
  );
}

export async function getUserSubscriptions(userId: string) {
  return sql<{
    id: string;
    method: SubscriptionMethod;
    course_shape: CourseShape;
    status: string;
    starts_at: string | null;
    ends_at: string | null;
  }>(
    `select id, method, course_shape, status, starts_at, ends_at from subscriptions where user_id=$1 order by created_at desc`,
    [userId],
  );
}

export async function confirmSubscription(
  subscriptionId: string,
  currentRole: Role,
) {
  const row = await sqlOne<{
    id: string;
    user_id: string;
    method: SubscriptionMethod;
    course_shape: CourseShape;
    status: string;
    starts_at: string | null;
    ends_at: string | null;
  }>(`select * from subscriptions where id=$1`, [subscriptionId]);
  if (!row) throw new Error("Subscription not found");
  const account = await sqlOne<{ role: Role }>(
    `select role from accounts where id=$1`,
    [row.user_id],
  );
  if (!account) throw new Error("Account not found");
  const result = confirmEnrollment(
    {
      id: row.id,
      userId: row.user_id,
      method: row.method,
      courseShape: row.course_shape,
      status: row.status as "pending",
      startsAt: row.starts_at,
      endsAt: row.ends_at,
    },
    account.role,
  );
  await sql(
    `update subscriptions set status=$1, starts_at=$2, ends_at=$3 where id=$4`,
    [
      result.subscription.status,
      result.subscription.startsAt,
      result.subscription.endsAt,
      subscriptionId,
    ],
  );
  await updateAccountRole(row.user_id, result.nextRole);

  if (result.subscription.courseShape === "oyuda") {
    const sessions = await listOyudaSessions();
    for (const s of sessions) {
      await sql(
        `insert into trainee_progress (id, user_id, course_key, session_order, done)
         values ($1,$2,'oyuda',$3,false)
         on conflict (user_id, course_key, session_order) do nothing`,
        [newId("tp"), row.user_id, s.order],
      );
    }
  }
  return result;
}

export async function declineSubscription(subscriptionId: string) {
  const row = await sqlOne<{
    id: string;
    user_id: string;
    method: SubscriptionMethod;
    course_shape: CourseShape;
    status: string;
    starts_at: string | null;
    ends_at: string | null;
  }>(`select * from subscriptions where id=$1`, [subscriptionId]);
  if (!row) throw new Error("Not found");
  const declined = declineEnrollment({
    id: row.id,
    userId: row.user_id,
    method: row.method,
    courseShape: row.course_shape,
    status: row.status as "pending",
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  });
  await sql(`update subscriptions set status=$1 where id=$2`, [
    declined.status,
    subscriptionId,
  ]);
}

export async function getProgress(userId: string, courseKey = "oyuda") {
  return sql<{ session_order: number; done: boolean }>(
    `select session_order, done from trainee_progress where user_id=$1 and course_key=$2 order by session_order`,
    [userId, courseKey],
  );
}

export async function markSessionDone(
  userId: string,
  courseKey: string,
  sessionOrder: number,
) {
  await sql(
    `update trainee_progress set done=true, done_at=now()
     where user_id=$1 and course_key=$2 and session_order=$3`,
    [userId, courseKey, sessionOrder],
  );
  const remaining = await sqlOne<{ c: string }>(
    `select count(*)::text as c from trainee_progress where user_id=$1 and course_key=$2 and done=false`,
    [userId, courseKey],
  );
  const sub = await sqlOne<{
    id: string;
    method: SubscriptionMethod;
    course_shape: CourseShape;
    status: string;
    starts_at: string | null;
    ends_at: string | null;
    user_id: string;
  }>(
    `select * from subscriptions where user_id=$1 and status='active' order by created_at desc limit 1`,
    [userId],
  );
  if (sub) {
    const next = completeOneTimeWhenSessionsDone(
      {
        id: sub.id,
        userId: sub.user_id,
        method: sub.method,
        courseShape: sub.course_shape,
        status: sub.status as "active",
        startsAt: sub.starts_at,
        endsAt: sub.ends_at,
      },
      Number(remaining?.c ?? 0),
    );
    if (next.status !== sub.status) {
      await sql(`update subscriptions set status=$1 where id=$2`, [
        next.status,
        sub.id,
      ]);
    }
  }
}

export async function createCustomRequest(input: {
  userId: string;
  subscriptionId: string;
  goal: string;
  sessionCount: number;
  topicIds: string[];
}) {
  const id = newId("ccr");
  await sql(
    `insert into custom_course_requests (id, user_id, subscription_id, goal, session_count, topic_ids, status)
     values ($1,$2,$3,$4,$5,$6,'pending')`,
    [
      id,
      input.userId,
      input.subscriptionId,
      input.goal,
      input.sessionCount,
      JSON.stringify(input.topicIds),
    ],
  );
  return id;
}

export async function listCustomRequests(status?: string) {
  if (status) {
    return sql<{
      id: string;
      user_id: string;
      display_name: string;
      goal: string;
      session_count: number;
      topic_ids: string;
      status: string;
      decline_reason: string | null;
    }>(
      `select r.*, a.display_name
       from custom_course_requests r join accounts a on a.id = r.user_id
       where r.status = $1
       order by r.created_at desc`,
      [status],
    );
  }
  return sql<{
    id: string;
    user_id: string;
    display_name: string;
    goal: string;
    session_count: number;
    topic_ids: string;
    status: string;
    decline_reason: string | null;
  }>(
    `select r.*, a.display_name
     from custom_course_requests r join accounts a on a.id = r.user_id
     order by r.created_at desc`,
  );
}

export async function acceptCustomRequest(
  requestId: string,
  sessions: Array<{ durationHours: number; topicIds: string[]; drills: string[] }>,
) {
  await sql(`update custom_course_requests set status='accepted' where id=$1`, [
    requestId,
  ]);
  const req = await sqlOne<{ user_id: string }>(
    `select user_id from custom_course_requests where id=$1`,
    [requestId],
  );
  if (!req) throw new Error("Request not found");
  for (let i = 0; i < sessions.length; i++) {
    const s = sessions[i];
    await sql(
      `insert into custom_course_sessions (id, request_id, session_order, duration_hours, topic_ids, drills)
       values ($1,$2,$3,$4,$5,$6)`,
      [
        newId("ccs"),
        requestId,
        i + 1,
        s.durationHours,
        JSON.stringify(s.topicIds),
        JSON.stringify(s.drills),
      ],
    );
    await sql(
      `insert into trainee_progress (id, user_id, course_key, session_order, done)
       values ($1,$2,$3,$4,false)
       on conflict (user_id, course_key, session_order) do nothing`,
      [newId("tp"), req.user_id, `custom:${requestId}`, i + 1],
    );
  }
}

export async function declineCustomRequest(requestId: string, reason: string) {
  await sql(
    `update custom_course_requests set status='declined', decline_reason=$1 where id=$2`,
    [reason, requestId],
  );
}
