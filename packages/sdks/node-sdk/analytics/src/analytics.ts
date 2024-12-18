import { debounce } from "lodash";
import { AnalyticsConfig, LogDetails } from "./types/index.js";

let currentPath = window.location.pathname;
let previousPath = "";
let isFirstLoad = true;

const analytics = ({ publicKey }: AnalyticsConfig) => {
  const handleRouteChange = debounce(() => {
    const newPath = window.location.pathname;
    if (newPath === currentPath && !isFirstLoad) {
      return;
    }
    previousPath = currentPath;
    currentPath = newPath;
    isFirstLoad = false;
    logEvent(publicKey || "");
  }, 0);

  // Log the first page visit
  handleRouteChange();

  window.removeEventListener("popstate", handleRouteChange);
  window.addEventListener("popstate", handleRouteChange);

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = (...args) => {
    originalPushState.apply(history, args);
    handleRouteChange();
  };

  history.replaceState = (...args) => {
    originalReplaceState.apply(history, args);
    handleRouteChange();
  };

  const cleanup = () => {
    window.removeEventListener("popstate", handleRouteChange);
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
  };

  return cleanup;
};

const logEvent = debounce(async (publicKey: string) => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const country = locale.split("-")[1];

  const logDetails: LogDetails = {
    currentPath,
    searchParams: window.location.search || "",
    previousPath: currentPath === previousPath ? "" : previousPath,
    country,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
  };

  if (
    process.env.NODE_ENV === "local" ||
    process.env.NODE_ENV === "development"
  ) {
    console.log("🚀 Hypership Analytics - Logged event", currentPath);
    return;
  }

  const accessToken = localStorage.getItem("accessToken");

  if (publicKey) {
    try {
      const response = await fetch(
        "https://backend.hypership.dev/v1/analytics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "hs-public-key": publicKey,
            "hs-user-access-token": accessToken || "",
          },
          body: JSON.stringify(logDetails),
        }
      );

      if (!response.ok) {
        console.error("🚀 Hypership Analytics - Failed to log event");
      }
    } catch (error) {
      throw new Error("Failed to log event");
    }
  }
}, 0);

export default analytics;
