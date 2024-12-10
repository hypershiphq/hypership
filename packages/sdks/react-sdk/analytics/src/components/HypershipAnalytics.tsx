import React, { useEffect, useRef } from "react";
import { hypershipAnalytics } from "../utils/analytics";
import { timezoneToCountryCodeMap } from "../utils/timeZoneMap"; // Your map as defined above

interface HypershipAnalyticsProps {
  apiKey: string;
}

export const HypershipAnalytics: React.FC<HypershipAnalyticsProps> = ({
  apiKey,
}) => {
  const previousPathRef = useRef<string | undefined>(undefined);

  // Helper function to resolve timezone to country
  const resolveCountryFromTimezone = (timeZone: string): string => {
    let entry = timezoneToCountryCodeMap[timeZone];

    // If the timezone is an alias, resolve to the aliased timezone
    if (entry?.a) {
      entry = timezoneToCountryCodeMap[entry.a];
    }

    // If there's a valid entry and the 'c' property exists and has at least one country code
    if (entry && entry.c && entry.c.length > 0) {
      return entry.c[0]; // Returning the first country for simplicity
    }

    return "Unknown"; // Fallback if no valid country is found
  };

  useEffect(() => {
    // Initialize Hypership analytics
    hypershipAnalytics.initialize(apiKey);

    const handlePageView = () => {
      // Determine the country from the timezone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const country = resolveCountryFromTimezone(timeZone);

      const currentPath = window.location.pathname;
      const searchParams = window.location.search;
      const previousPath = previousPathRef.current;
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;
      const timestamp = new Date().toISOString();
      const title = document.title;

      // Update the previousPathRef with the current path
      previousPathRef.current = currentPath;

      // Log the page view with the determined country
      hypershipAnalytics.logPageView({
        currentPath,
        searchParams,
        previousPath,
        userAgent,
        referrer,
        timestamp,
        title,
        country,
      });
    };

    // Log the initial page view
    handlePageView();

    // Listen for URL changes
    const handlePopState = () => {
      handlePageView();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [apiKey]);

  // This component doesn't render any UI
  return null;
};
