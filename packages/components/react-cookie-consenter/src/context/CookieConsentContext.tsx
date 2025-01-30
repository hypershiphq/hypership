import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import CookieConsenter from "../components/CookieConsenter";
import type { CookieConsenterProps } from "../types/types";

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
  showConsentBanner: () => void;
  acceptCookies: () => void;
  declineCookies: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export interface CookieConsentProviderProps
  extends Omit<CookieConsenterProps, "onAccept" | "onDecline" | "forceShow"> {
  children: React.ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({
  children,
  cookieName = "cookie-consent",
  onManage,
  experimentallyBlockTracking = false,
  experimentalBlockedDomains = [],
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsent, setHasConsent] = useState<boolean | null>(() => {
    const consent = localStorage.getItem(cookieName);
    return consent === "true" ? true : consent === "false" ? false : null;
  });
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // Show banner if no consent decision has been made
    if (hasConsent === null) {
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
  }, [hasConsent, experimentallyBlockTracking, experimentalBlockedDomains]);

  const showConsentBanner = () => {
    setHasConsent(null);
    setIsVisible(true);
    localStorage.setItem(cookieName, "null");
  };

  const acceptCookies = () => {
    localStorage.setItem(cookieName, "true");
    setHasConsent(true);
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem(cookieName, "false");
    setHasConsent(false);
    setIsVisible(false);
  };

  const handleManage = () => {
    setIsVisible(false);
    if (onManage) {
      onManage();
    }
  };

  const value: CookieConsentContextValue = {
    hasConsent: hasConsent,
    isDeclined: hasConsent === false,
    showConsentBanner,
    acceptCookies,
    declineCookies,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {isVisible && (
        <CookieConsenter
          {...props}
          cookieName={cookieName}
          onAccept={acceptCookies}
          onDecline={declineCookies}
          onManage={handleManage}
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
