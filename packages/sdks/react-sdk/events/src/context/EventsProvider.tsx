// src/context/EventsProvider.tsx
import React, { createContext, useContext } from "react";
import { EventsContextProps } from "../types/types";
import { apiRequest } from "../utils/apiClient";
import { validateConfig } from "../utils/validateConfig";

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

interface EventsProviderProps {
  publicKey: string;
  children: React.ReactNode;
}

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1].trim()) : null;
};

export const EventsProvider: React.FC<EventsProviderProps> = ({
  publicKey,
  children,
}) => {
  // Validate the configuration
  validateConfig(publicKey);

  // Retrieve access token from cookie
  const accessToken = getCookie("accessToken");

  // Function to log events
  const trackEvent = async (key: string, metadata: object) => {
    try {
      const payload = {
        eventKey: key,
        metadata: metadata,
      };
      await apiRequest("/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "hs-public-key": publicKey,
          "hs-user-access-token": accessToken || "",
        },
        body: JSON.stringify(payload),
      });
    } catch (error: any) {
      if (error?.status === "error" && error?.error) {
        const { code, message } = error.error;

        if (code === "BAD_REQUEST" && message === "Invalid event key.") {
          console.error(
            "Invalid event key provided. Event keys must follow the required format. Please check the event key in your Hypership dashboard."
          );
        } else {
          console.error(`API Error: ${message}`);
        }
      } else {
        console.error("Unexpected error logging event:", error);
      }
    }
  };

  return (
    <EventsContext.Provider value={{ trackEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

// Custom hook to use the EventsContext
export const useEvents = (): EventsContextProps => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error(
      "Hypership useEvents must be used within a HypershipEventsProvider"
    );
  }
  return context;
};
