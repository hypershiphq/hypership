import { CookieCategories } from "../types/types";
import { trackers } from "./trackers";

export const getBlockedHosts = (
  preferences: CookieCategories | null
): string[] => {
  if (!preferences) {
    // If no preferences set, block everything
    return Object.values(trackers.categories).flat();
  }

  const blockedHosts: string[] = [];

  // Add hosts based on declined categories
  if (!preferences.Analytics) {
    blockedHosts.push(...trackers.categories.Analytics);
  }
  if (!preferences.Social) {
    blockedHosts.push(...trackers.categories.Social);
  }
  if (!preferences.Advertising) {
    blockedHosts.push(...trackers.categories.Advertising);
  }

  return [...new Set(blockedHosts)]; // Remove duplicates
};

export const getBlockedKeywords = (
  preferences: CookieCategories | null
): string[] => {
  if (!preferences) {
    // If no preferences set, block everything
    return Object.values(trackers.categories)
      .flat()
      .map((host) => host.replace(/\.[^.]+$/, ""));
  }

  const blockedHosts = getBlockedHosts(preferences);
  // Convert hosts to keywords by removing the TLD
  return [...new Set(blockedHosts.map((host) => host.replace(/\.[^.]+$/, "")))];
};
