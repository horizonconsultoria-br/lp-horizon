import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Link Google Calendar do CTO — fornecido pelo founder no kickoff (input B do plano). */
export const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL || "https://calendar.app.google/PLACEHOLDER-FOUNDER-PROVIDE";
