// src/components/HypershipEvents.tsx

import React from "react";
import { EventsProvider } from "../context/EventsProvider";
import { getHypershipPublicKey } from "../utils/getPublicKey";
interface HypershipEventsProps {
  apiKey?: string;
  children: React.ReactNode;
}

export const HypershipEventsProvider: React.FC<HypershipEventsProps> = ({
  apiKey,
  children,
}) => {
  const publicKey = apiKey || getHypershipPublicKey();
  if (!publicKey) {
    throw new Error("HypershipEvents: Public key is required");
  }
  return <EventsProvider publicKey={publicKey}>{children}</EventsProvider>;
};
