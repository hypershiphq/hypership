import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import CookieConsenter from "../components/CookieConsenter";
import type {
  CookieConsenterProps,
  DetailedCookieConsent,
  CookieCategories,
} from "../types/types";

const DEFAULT_BLOCKED_HOSTS = [
  "www.google-analytics.com",
  "connect.facebook.net",
  "static.hotjar.com",
  "cdn.segment.com",
  "api.fullstory.com",
  "intercom.io",
  "matomo.org",
];

const DEFAULT_TRACKING_KEYWORDS = [
  "googletagmanager.com",
  "google-analytics.com",
  "facebook.net",
  "hotjar.com",
  "segment.com",
  "intercom.io",
  "fullstory.com",
  "matomo.js",
  "ads.js",
];

// Store original functions
let originalXhrOpen: typeof XMLHttpRequest.prototype.open | null = null;
let originalFetch: typeof window.fetch | null = null;

const blockTrackingRequests = (blockedHosts: string[]) => {
  // Store original functions if not already stored
  if (!originalXhrOpen) {
    originalXhrOpen = XMLHttpRequest.prototype.open;
  }
  if (!originalFetch) {
    originalFetch = window.fetch;
  }

  // Override XMLHttpRequest to block requests to tracking domains
  XMLHttpRequest.prototype.open = function (method: string, url: string | URL) {
    const urlString = url.toString();
    if (blockedHosts.some((host) => urlString.includes(host))) {
      console.warn(`[Cookie Consenter] Blocked tracking request: ${urlString}`);
      return;
    }
    return originalXhrOpen!.apply(this, arguments as any);
  };

  // Override fetch API to block tracking requests
  window.fetch = function (url: RequestInfo | URL, options?: RequestInit) {
    const urlString = url.toString();
    if (
      typeof urlString === "string" &&
      blockedHosts.some((host) => urlString.includes(host))
    ) {
      console.warn(`[Cookie Consenter] Blocked tracking fetch: ${urlString}`);
      return Promise.resolve(
        new Response(null, { status: 403, statusText: "Blocked" })
      );
    }
    return originalFetch!.apply(this, arguments as any);
  };
};

const restoreOriginalRequests = () => {
  if (originalXhrOpen) {
    XMLHttpRequest.prototype.open = originalXhrOpen;
  }
  if (originalFetch) {
    window.fetch = originalFetch;
  }
  console.log("[Cookie Consenter] Restored original XHR and fetch functions");
};

const blockTrackingScripts = (trackingKeywords: string[]) => {
  // Remove all script tags that match tracking domains
  document.querySelectorAll("script").forEach((script) => {
    if (
      script.src &&
      trackingKeywords.some((keyword) => script.src.includes(keyword))
    ) {
      script.remove();
      console.log(`[Cookie Consenter] Blocked script: ${script.src}`);
    }
  });

  // Prevent new tracking scripts from being injected
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.tagName === "SCRIPT") {
          const src = node.getAttribute("src");
          if (
            src &&
            trackingKeywords.some((keyword) => src.includes(keyword))
          ) {
            node.remove();
            console.log(
              `[Cookie Consenter] Blocked dynamically injected script: ${src}`
            );
          }
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  return observer;
};

interface CookieConsentContextValue {
  hasConsent: boolean | null;
  isDeclined: boolean;
  detailedConsent: DetailedCookieConsent | null;
  showConsentBanner: () => void;
  acceptCookies: () => void;
  declineCookies: () => void;
  updateDetailedConsent: (preferences: CookieCategories) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export interface CookieConsentProviderProps
  extends Omit<CookieConsenterProps, "onAccept" | "onDecline" | "forceShow"> {
  children: React.ReactNode;
}

const createConsentStatus = (consented: boolean) => ({
  consented,
  timestamp: new Date().toISOString(),
});

const createDetailedConsent = (consented: boolean): DetailedCookieConsent => ({
  Analytics: createConsentStatus(consented),
  Social: createConsentStatus(consented),
  Advertising: createConsentStatus(consented),
});

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({
  children,
  cookieName = "cookie-consent",
  onManage,
  experimentallyBlockTracking = false,
  experimentalBlockedDomains = [],
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [detailedConsent, setDetailedConsent] =
    useState<DetailedCookieConsent | null>(() => {
      const storedConsent = localStorage.getItem(cookieName);
      if (storedConsent) {
        try {
          return JSON.parse(storedConsent);
        } catch (e) {
          return null;
        }
      }
      return null;
    });

  const hasConsent = detailedConsent
    ? Object.values(detailedConsent).some((status) => status.consented)
    : null;

  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // Show banner if no consent decision has been made
    if (detailedConsent === null) {
      setIsVisible(true);
    }

    // Handle tracking blocking
    if (experimentallyBlockTracking) {
      if (hasConsent === true) {
        // Restore original functions when consent is given
        restoreOriginalRequests();
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      } else {
        // Block tracking when no consent or declined
        const allBlockedHosts = [
          ...DEFAULT_BLOCKED_HOSTS,
          ...experimentalBlockedDomains,
        ];
        const allTrackingKeywords = [
          ...DEFAULT_TRACKING_KEYWORDS,
          ...experimentalBlockedDomains,
        ];

        console.log("[Cookie Consenter] Blocking tracking with:", {
          allBlockedHosts,
          allTrackingKeywords,
        });

        blockTrackingRequests(allBlockedHosts);
        observerRef.current = blockTrackingScripts(allTrackingKeywords);
      }
    }

    return () => {
      if (observerRef.current) {
        console.log("[Cookie Consenter] Cleaning up observer");
        observerRef.current.disconnect();
      }
    };
  }, [
    detailedConsent,
    experimentallyBlockTracking,
    experimentalBlockedDomains,
  ]);

  const showConsentBanner = () => {
    // setDetailedConsent(null);
    setIsVisible(true);
    // localStorage.removeItem(cookieName);
  };

  const acceptCookies = () => {
    const newConsent = createDetailedConsent(true);
    localStorage.setItem(cookieName, JSON.stringify(newConsent));
    setDetailedConsent(newConsent);
    setIsVisible(false);
  };

  const declineCookies = () => {
    const newConsent = createDetailedConsent(false);
    localStorage.setItem(cookieName, JSON.stringify(newConsent));
    setDetailedConsent(newConsent);
    setIsVisible(false);
  };

  const updateDetailedConsent = (preferences: CookieCategories) => {
    const timestamp = new Date().toISOString();
    const newConsent: DetailedCookieConsent = {
      Analytics: { consented: preferences.Analytics, timestamp },
      Social: { consented: preferences.Social, timestamp },
      Advertising: { consented: preferences.Advertising, timestamp },
    };
    localStorage.setItem(cookieName, JSON.stringify(newConsent));
    setDetailedConsent(newConsent);
    setIsManaging(false);
  };

  const handleManage = () => {
    setIsManaging(true);
    setIsVisible(false);
    if (onManage) {
      onManage();
    }
  };

  const value: CookieConsentContextValue = {
    hasConsent,
    isDeclined: hasConsent === false,
    detailedConsent,
    showConsentBanner,
    acceptCookies,
    declineCookies,
    updateDetailedConsent,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {(isVisible || isManaging) && (
        <CookieConsenter
          {...props}
          cookieName={cookieName}
          onAccept={acceptCookies}
          onDecline={declineCookies}
          onManage={handleManage}
          detailedConsent={detailedConsent}
          initialPreferences={
            detailedConsent
              ? {
                  Analytics: detailedConsent.Analytics.consented,
                  Social: detailedConsent.Social.consented,
                  Advertising: detailedConsent.Advertising.consented,
                }
              : undefined
          }
          isManaging={isManaging}
        />
      )}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
};
