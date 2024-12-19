// src/types/index.ts

export interface PageViewData {
  currentPath: string;
  searchParams?: string;
  previousPath?: string | null;
  userAgent?: string;
  referrer?: string;
  timestamp?: string;
  title?: string;
  country?: string | null; // Updated to include null
}
