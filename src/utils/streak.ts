import { dayKey, daysBetween } from "./date";
import { milestoneMessages } from "../content/copy";

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
}

/**
 * Gentle streak rule: a missed day pauses the streak (doesn't reset it),
 * two missed days in a row resets it to zero.
 */
export function computeStreak(
  timestamps: string[],
  today: Date = new Date()
): StreakResult {
  const totalEntries = timestamps.length;
  if (totalEntries === 0) {
    return { currentStreak: 0, longestStreak: 0, totalEntries: 0 };
  }

  const activeDays = Array.from(new Set(timestamps.map((t) => dayKey(t)))).sort();

  let currentStreak = 1;
  let longestStreak = 1;

  for (let i = 1; i < activeDays.length; i++) {
    const missedDays = daysBetween(activeDays[i - 1], activeDays[i]) - 1;
    if (missedDays <= 1) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  const lastActiveDay = activeDays[activeDays.length - 1];
  const missedSinceLastActive = daysBetween(lastActiveDay, dayKey(today)) - 1;
  if (missedSinceLastActive > 1) {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak, totalEntries };
}

const MILESTONE_COUNTS = [3, 7, 21] as const;

export function milestoneForCount(count: number): string | null {
  return MILESTONE_COUNTS.includes(count as (typeof MILESTONE_COUNTS)[number])
    ? milestoneMessages[count as 3 | 7 | 21]
    : null;
}
