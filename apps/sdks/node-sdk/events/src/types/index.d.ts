declare module '@hypership/events' {
  export interface EventsConfig {
    apiKey?: string;
  }

  export function HypershipEvents(config: EventsConfig): void;
}