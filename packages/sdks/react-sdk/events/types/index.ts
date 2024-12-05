// src/types/index.ts

export interface HypershipConfig {
  publicKey: string;
  secretKey: string;
  apiBaseUrl?: string;
}

export interface EventData {
  eventName: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface EventsContextProps {
  trackEvent: (key: string, eventData: object) => Promise<void>;
}
