export type CrowdLevel = "Very Low" | "Low" | "Medium" | "High" | "Very High";
export type MealPeriod = "Breakfast" | "Lunch" | "Snacks" | "Dinner";

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const MEALS: MealPeriod[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];

export const PROBLEM_CATEGORIES = [
  "Food Quality",
  "Food Quantity",
  "Hygiene",
  "Seating",
  "Water",
  "Cleaning",
  "Service",
  "Other",
] as const;

export const PROBLEM_STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"] as const;

export type Thresholds = {
  very_low_max: number;
  low_max: number;
  medium_max: number;
  high_max: number;
};

export function crowdLevel(peopleInside: number, t: Thresholds): CrowdLevel {
  if (peopleInside <= t.very_low_max) return "Very Low";
  if (peopleInside <= t.low_max) return "Low";
  if (peopleInside <= t.medium_max) return "Medium";
  if (peopleInside <= t.high_max) return "High";
  return "Very High";
}

export function crowdTone(level: CrowdLevel): string {
  switch (level) {
    case "Very Low":
      return "bg-success/12 text-success border-success/30";
    case "Low":
      return "bg-success/12 text-success border-success/30";
    case "Medium":
      return "bg-warning/12 text-warning border-warning/30";
    case "High":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "Very High":
      return "bg-destructive/15 text-destructive border-destructive/40";
  }
}

export function occupancyStats(peopleInside: number, totalSeats: number) {
  const inside = Math.max(0, peopleInside);
  const seats = Math.max(1, totalSeats);
  const available = Math.max(0, Math.min(seats, seats - inside));
  const percent = Math.round(Math.max(0, Math.min(100, (available / seats) * 100)));
  return { inside, totalSeats: seats, available, percent };
}

export function todayName(date = new Date()): (typeof DAYS)[number] {
  const idx = (date.getDay() + 6) % 7;
  return DAYS[idx]!;
}

type MealWindows = {
  breakfast_start: string;
  breakfast_end: string;
  lunch_start: string;
  lunch_end: string;
  snacks_start: string;
  snacks_end: string;
  dinner_start: string;
  dinner_end: string;
};

function toMinutes(t: string): number {
  const [h = "0", m = "0"] = t.split(":");
  return Number(h) * 60 + Number(m);
}

export function currentMealPeriod(w: MealWindows, date = new Date()): MealPeriod | null {
  const now = date.getHours() * 60 + date.getMinutes();
  const windows: [MealPeriod, string, string][] = [
    ["Breakfast", w.breakfast_start, w.breakfast_end],
    ["Lunch", w.lunch_start, w.lunch_end],
    ["Snacks", w.snacks_start, w.snacks_end],
    ["Dinner", w.dinner_start, w.dinner_end],
  ];
  for (const [meal, start, end] of windows) {
    if (now >= toMinutes(start) && now <= toMinutes(end)) return meal;
  }
  return null;
}

export function formatTime(t: string) {
  return t.slice(0, 5);
}
