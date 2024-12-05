export interface AnalyticsConfig {
  publicKey?: string | undefined;
}

export interface LogDetails {
  currentPath: string;
  searchParams: string;
  previousPath: string;
  country: string;
  userAgent: string;
  referrer: string;
  timestamp: string;
}