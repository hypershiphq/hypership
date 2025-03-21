import React, { useEffect, useRef } from "react";
import { hypershipAnalytics } from "../utils/pageview";
import { timezoneToCountryCodeMap } from "../utils/timeZoneMap";
import { getHypershipPublicKey } from "../utils/getPublicKey";

interface HypershipAnalyticsProps {
  apiKey?: string;
}

export const HypershipAnalyticsProvider: React.FC<HypershipAnalyticsProps> = ({
  apiKey,
}) => {
  const previousPathRef = useRef<string | undefined>(undefined);
  const isFirstPageLoadRef = useRef<boolean>(true); // Prevent double log on initial load

  const resolveCountryFromTimezone = (timeZone: string): string => {
    const entry = timezoneToCountryCodeMap[timeZone]?.a
      ? timezoneToCountryCodeMap[timezoneToCountryCodeMap[timeZone].a]
      : timezoneToCountryCodeMap[timeZone];

    return entry?.c?.[0] ?? "Unknown";
  };

  const logPageView = () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const country = resolveCountryFromTimezone(timeZone);
    const currentPath = window.location.pathname;
    const searchParams = window.location.search;
    const previousPath = previousPathRef.current;
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;
    const timestamp = new Date().toISOString();
    const title = document.title;

    previousPathRef.current = currentPath;

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

  useEffect(() => {
    const resolvedApiKey = apiKey || getHypershipPublicKey();
    if (!resolvedApiKey) {
      throw new Error(
        "HypershipAnalytics: API key is required. Have you set up your .env file with your Hypership project API key? Check out the quick start guide to learn how."
      );
    }
    hypershipAnalytics.initialize(resolvedApiKey);

    if (isFirstPageLoadRef.current) {
      // Log page view only on first load
      logPageView();
      isFirstPageLoadRef.current = false;
    }

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const handleHistoryChange = () => {
      logPageView();
    };

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleHistoryChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleHistoryChange();
    };

    window.addEventListener("popstate", handleHistoryChange);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handleHistoryChange);
    };
  }, [apiKey]);

  return null;
};
