import { promptsOfTheDay } from "../content/promptsOfTheDay";
import { dayOfYear } from "./date";

export function promptOfTheDay(date: Date = new Date()): string {
  const index = (dayOfYear(date) - 1) % promptsOfTheDay.length;
  return promptsOfTheDay[index];
}
