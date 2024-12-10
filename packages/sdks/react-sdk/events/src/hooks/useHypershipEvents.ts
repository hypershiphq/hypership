// src/hooks/useEventLogger.ts

import { useEvents } from "../context/EventsProvider";

export const useHypershipEvents = () => {
  const { trackEvent } = useEvents();

  // Additional logic can be added here if needed
  return { trackEvent };
};
