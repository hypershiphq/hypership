// src/components/HypershipEvents.tsx

import React from "react";
import { EventsProvider } from "../context/EventsProvider";

interface HypershipEventsProps {
  apiKey: string;
  children: React.ReactNode;
}

export const HypershipEventsProvider: React.FC<HypershipEventsProps> = ({
  apiKey,
  children,
}) => {
  return <EventsProvider publicKey={apiKey}>{children}</EventsProvider>;
};
