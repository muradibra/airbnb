import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setMidnightUTC = (date: Date | string) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const fixedDate = new Date(
    Date.UTC(
      date.getFullYear(), // Get the full year in local time
      date.getMonth(), // Get the month in local time
      date.getDate(), // Get the day in local time
      0,
      0,
      0,
      0 // Set the time to 00:00:00 UTC
    )
  );

  console.log("⏳ Fixed Date:", fixedDate.toISOString());

  return fixedDate;
};
