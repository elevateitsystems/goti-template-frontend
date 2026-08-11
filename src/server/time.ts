import "server-only";

import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const EASTERN_TIME_ZONE = "America/New_York";

export function easternDateKey(date = new Date()) {
  return formatInTimeZone(date, EASTERN_TIME_ZONE, "yyyy-MM-dd");
}

export function easternDate(date = new Date()) {
  return new Date(`${easternDateKey(date)}T00:00:00.000Z`);
}

export function easternWeekStart(date = new Date()) {
  const easternDay = easternDate(date);
  const weekday = easternDay.getUTCDay();
  const daysSinceMonday = (weekday + 6) % 7;
  easternDay.setUTCDate(easternDay.getUTCDate() - daysSinceMonday);
  return easternDay;
}

export function parseEasternDateTime(value: string | Date | null | undefined) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = /(?:Z|[+-]\d{2}:?\d{2})$/.test(value)
    ? new Date(value)
    : fromZonedTime(value, EASTERN_TIME_ZONE);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid Eastern date/time");
  return parsed;
}

export function formatEasternDateTime(value: string | Date) {
  return formatInTimeZone(new Date(value), EASTERN_TIME_ZONE, "MMM d, yyyy h:mm a 'ET'");
}

export function isScheduledPublicationDue(
  publicationStatus: string,
  scheduledAt: string | Date | null,
  now = new Date(),
) {
  return publicationStatus === "scheduled" && scheduledAt !== null && new Date(scheduledAt) <= now;
}
