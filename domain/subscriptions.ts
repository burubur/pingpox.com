import type { Role } from "./roles";
import { roleAfterEnrollmentConfirmed } from "./roles";

export type SubscriptionMethod = "monthly" | "one_time";
export type CourseShape = "oyuda" | "custom";
export type SubscriptionStatus = "pending" | "active" | "declined" | "completed" | "expired";

export type Subscription = {
  id: string;
  userId: string;
  method: SubscriptionMethod;
  courseShape: CourseShape;
  status: SubscriptionStatus;
  startsAt: string | null;
  endsAt: string | null;
};

export type EnrollmentInput = {
  method: SubscriptionMethod;
  courseShape: CourseShape;
};

export function createPendingEnrollment(
  userId: string,
  input: EnrollmentInput,
  id: string,
): Subscription {
  return {
    id,
    userId,
    method: input.method,
    courseShape: input.courseShape,
    status: "pending",
    startsAt: null,
    endsAt: null,
  };
}

export function confirmEnrollment(
  subscription: Subscription,
  currentRole: Role,
  now = new Date(),
): { subscription: Subscription; nextRole: Role } {
  if (subscription.status !== "pending") {
    throw new Error("Only pending enrollments can be confirmed");
  }
  const startsAt = now.toISOString();
  let endsAt: string | null = null;
  if (subscription.method === "monthly") {
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    endsAt = end.toISOString();
  }
  return {
    subscription: {
      ...subscription,
      status: "active",
      startsAt,
      endsAt,
    },
    nextRole: roleAfterEnrollmentConfirmed(currentRole),
  };
}

export function declineEnrollment(subscription: Subscription): Subscription {
  if (subscription.status !== "pending") {
    throw new Error("Only pending enrollments can be declined");
  }
  return { ...subscription, status: "declined" };
}

export function completeOneTimeWhenSessionsDone(
  subscription: Subscription,
  remainingSessions: number,
): Subscription {
  if (subscription.method !== "one_time" || subscription.status !== "active") {
    return subscription;
  }
  if (remainingSessions <= 0) {
    return { ...subscription, status: "completed" };
  }
  return subscription;
}

export function expireMonthlyIfPast(
  subscription: Subscription,
  now = new Date(),
): Subscription {
  if (
    subscription.method === "monthly" &&
    subscription.status === "active" &&
    subscription.endsAt &&
    new Date(subscription.endsAt) < now
  ) {
    return { ...subscription, status: "expired" };
  }
  return subscription;
}
