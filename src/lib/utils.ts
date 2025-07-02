import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateBroadcastProgress(startDateString: string, endDateString: string) {
  const today = new Date();
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();
  const remaining = endDate.getTime() - today.getTime();

  const progress = Math.min(
    100,
    Math.max(0, Math.round((elapsed / totalDuration) * 100))
  );

  const daysRemaining = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));

  return { progress, daysRemaining };
}