import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CookieConsenterProps } from "../types/types";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // matches Tailwind's sm breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

const MobileModal: React.FC<
  CookieConsenterProps & {
    handleAccept: () => void;
    handleDecline: () => void;
    handleManage?: () => void;
  }
> = ({
  buttonText,
  declineButtonText,
  manageButtonText,
  showManageButton,
  privacyPolicyText,
  privacyPolicyUrl,
  title,
  message,
  theme,
  handleAccept,
  handleDecline,
  handleManage,
  isExiting,
  isEntering,
  displayType = "banner",
}) => {
  return (
    <>
      {displayType === "modal" && (
        <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm" />
      )}
      <div
        className={`
        fixed inset-x-0 bottom-0 px-4 pb-4 pt-2 z-[99999]
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${
          isExiting
            ? "translate-y-full"
            : isEntering
              ? "translate-y-full"
              : "translate-y-0"
        }
      `}
      >
        <div
          className={`
            p-4 mx-auto max-w-[calc(100vw-32px)]
            ${
              theme === "light"
                ? "bg-white/95 ring-1 ring-black/10"
                : "bg-black/95 ring-1 ring-white/10"
            }
            rounded-2xl backdrop-blur-sm backdrop-saturate-150
          `}
        >
          <div className="flex flex-col gap-3">
            {title && (
              <h3
                className={`font-semibold -my-2 mt-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                {title}
              </h3>
            )}
            <p
              className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-200"}`}
            >
              {message}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAccept}
                className="w-full px-3 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus-visible:outline-none focus:outline-none focus-visible:outline-transparent focus:outline-transparent"
              >
                {buttonText}
              </button>
              <button
                onClick={handleDecline}
                className={`w-full px-3 py-2.5 text-sm font-medium rounded-lg focus-visible:outline-none focus:outline-none focus-visible:outline-transparent focus:outline-transparent
                  ${
                    theme === "light"
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
              >
                {declineButtonText}
              </button>
              {showManageButton && (
                <button
                  onClick={handleManage}
                  className="w-full px-3 py-2.5 text-sm font-medium bg-transparent text-blue-500 border border-blue-500 rounded-lg hover:text-blue-400 hover:border-blue-400 focus-visible:outline-none focus:outline-none focus-visible:outline-transparent focus:outline-transparent"
                >
                  {manageButtonText}
                </button>
              )}
            </div>
            {privacyPolicyUrl && (
              <a
                href={privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs ${theme === "light" ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-gray-200"}`}
              >
                {privacyPolicyText}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

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

const blockTrackingRequests = (blockedHosts: string[]) => {
  // Override XMLHttpRequest to block requests to tracking domains
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method: string, url: string | URL) {
    const urlString = url.toString();
    if (blockedHosts.some((host) => urlString.includes(host))) {
      console.warn(`[Cookie Consenter] Blocked tracking request: ${urlString}`);
      return;
    }
    return originalXhrOpen.apply(this, arguments as any);
  };

  // Override fetch API to block tracking requests
  const originalFetch = window.fetch;
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
    return originalFetch.apply(this, arguments as any);
  };
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

const CookieConsenter: React.FC<CookieConsenterProps> = ({
  buttonText = "Accept",
  declineButtonText = "Decline",
  manageButtonText = "Manage Cookies",
  showManageButton = false,
  privacyPolicyText = "Privacy Policy",
  privacyPolicyUrl,
  title = "",
  message = "This website uses cookies to enhance your experience.",
  cookieName = "cookie-consent",
  displayType = "banner",
  theme = "light",
  experimentalBlockTracking = false,
  experimentalBlockedDomains = [],
  onAccept,
  onDecline,
  onManage,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const isMobile = useIsMobile();
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const hasConsent = localStorage.getItem(cookieName) === "true";
    const hasDeclined = localStorage.getItem(cookieName) === "false";

    if (hasDeclined && experimentalBlockTracking) {
      const allBlockedHosts = [
        ...DEFAULT_BLOCKED_HOSTS,
        ...experimentalBlockedDomains,
      ];
      const allTrackingKeywords = [
        ...DEFAULT_TRACKING_KEYWORDS,
        ...experimentalBlockedDomains,
      ];

      blockTrackingRequests(allBlockedHosts);
      observerRef.current = blockTrackingScripts(allTrackingKeywords);
    }

    if (!hasConsent && !hasDeclined) {
      setIsVisible(true);
      setTimeout(() => {
        setIsEntering(false);
      }, 50);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [cookieName, experimentalBlockTracking, experimentalBlockedDomains]);

  const handleAccept = () => {
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem(cookieName, "true");
      setIsVisible(false);
      if (onAccept) onAccept();
    }, 500);
  };

  const handleDecline = () => {
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem(cookieName, "false");
      setIsVisible(false);
      if (onDecline) onDecline();
    }, 500);
  };

  const handleManage = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onManage) onManage();
    }, 500);
  };

  if (!isVisible) return null;

  // Temporary test function
  const testTrackingBlocker = () => {
    console.log("Testing tracking blocker...");

    // Test script injection
    const script = document.createElement("script");
    script.src = "https://www.google-analytics.com/analytics.js";
    document.body.appendChild(script);

    // Test fetch request
    fetch("https://www.google-analytics.com/collect")
      .then((res) => console.log("Fetch response:", res.status))
      .catch((err) => console.log("Fetch blocked:", err));

    // Test XHR request
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.google-analytics.com/collect");
    try {
      xhr.send();
    } catch (e) {
      console.log("XHR blocked");
    }
  };

  // Add temporary test button
  const TestButton = () => (
    <button
      onClick={testTrackingBlocker}
      className="fixed top-4 right-4 px-3 py-2 bg-red-500 text-white rounded-md text-sm z-[99999]"
    >
      Test Blocker
    </button>
  );

  // On mobile, always render the MobileModal regardless of displayType
  if (isMobile) {
    return createPortal(
      <>
        <MobileModal
          {...{
            buttonText,
            declineButtonText,
            manageButtonText,
            showManageButton,
            privacyPolicyText,
            privacyPolicyUrl,
            title,
            message,
            theme,
            handleAccept,
            handleDecline,
            handleManage,
            isExiting,
            isEntering,
            displayType,
          }}
        />
      </>,
      document.body
    );
  }

  const bannerBaseClasses = `
    fixed bottom-4 left-1/2 -translate-x-1/2 w-full md:max-w-2xl
    ${
      theme === "light"
        ? "bg-white/95 ring-1 ring-black/10 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]"
        : "bg-black/95 ring-1 ring-white/10"
    }
    rounded-lg backdrop-blur-sm backdrop-saturate-150 
    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
    z-[99999] hover:-translate-y-2
    ${
      isExiting
        ? "opacity-0 transform translate-y-full"
        : isEntering
          ? "opacity-0 transform translate-y-full"
          : "opacity-100 transform translate-y-0"
    }
  `;

  const popupBaseClasses = `
    fixed bottom-4 left-4 w-80
    ${
      theme === "light"
        ? "bg-white/95 ring-1 ring-black/10"
        : "bg-black/95 ring-1 ring-white/10"
    }
    rounded-lg backdrop-blur-sm backdrop-saturate-150 
    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
    z-[99999] hover:-translate-y-2
    ${
      isExiting
        ? "opacity-0 scale-95"
        : isEntering
          ? "opacity-0 scale-95"
          : "opacity-100 scale-100"
    }
  `;

  const bannerContentClasses = `
    flex flex-col gap-4 p-4
    ${theme === "light" ? "text-gray-600" : "text-gray-300"}
  `;

  const popupContentClasses = `
    flex flex-col items-start gap-4 p-4
    ${theme === "light" ? "text-gray-600" : "text-gray-300"}
  `;

  const bannerTitleClasses = `
    text-sm font-semibold mb-1
    ${theme === "light" ? "text-gray-900" : "text-white"}
  `;

  const popupTitleClasses = `
    text-sm font-semibold mb-2
    ${theme === "light" ? "text-gray-900" : "text-white"}
  `;

  const bannerMessageClasses = `
    text-xs sm:text-sm font-medium text-center sm:text-left
    ${theme === "light" ? "text-gray-700" : "text-gray-200"}
  `;

  const popupMessageClasses = `
    text-xs font-medium
    ${theme === "light" ? "text-gray-700" : "text-gray-200"}
  `;

  const bannerButtonGroupClasses = "flex items-center justify-between w-full";
  const popupButtonGroupClasses = "flex items-center justify-between w-full";
  const modalButtonGroupClasses = "flex items-center justify-between w-full";

  const acceptButtonClasses = `
    px-3 py-1.5 text-xs font-medium rounded-md
    bg-blue-500 hover:bg-blue-600 text-white
    transition-all duration-200
    hover:scale-105 focus-visible:outline-none focus:outline-none
    focus-visible:outline-transparent focus:outline-transparent
    ${displayType === "popup" ? "flex-1" : ""}
  `;

  const declineButtonClasses = `
    px-3 py-1.5 text-xs font-medium rounded-md
    ${
      theme === "light"
        ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
    }
    transition-all duration-200
    hover:scale-105 focus-visible:outline-none focus:outline-none
    focus-visible:outline-transparent focus:outline-transparent
    ${displayType === "popup" ? "flex-1" : ""}
  `;

  const manageButtonClasses = `
    px-3 py-1.5 text-xs font-medium rounded-md
    border border-blue-500 text-blue-500
    bg-transparent
    hover:text-blue-600 hover:border-blue-600
    transition-all duration-200
    hover:scale-105 focus-visible:outline-none focus:outline-none
    focus-visible:outline-transparent focus:outline-transparent
  `;

  const privacyLinkClasses = `
    text-xs font-medium
    ${
      theme === "light"
        ? "text-gray-500 hover:text-gray-700"
        : "text-gray-400 hover:text-gray-200"
    }
    transition-colors duration-200
  `;

  const modalBaseClasses = `
    fixed inset-0 flex items-center justify-center p-4
    ${
      theme === "light"
        ? "bg-black/20 backdrop-blur-sm"
        : "bg-black/40 backdrop-blur-sm"
    }
    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
    z-[99999]
    ${isExiting ? "opacity-0" : isEntering ? "opacity-0" : "opacity-100"}
  `;

  const modalContentClasses = `
    w-full max-w-lg rounded-xl p-6
    ${
      theme === "light"
        ? "bg-white/95 ring-1 ring-black/10"
        : "bg-black/95 ring-1 ring-white/10"
    }
    ${isExiting ? "scale-95" : isEntering ? "scale-95" : "scale-100"}
    transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
  `;

  const modalTitleClasses = `
    text-lg font-semibold mb-3
    ${theme === "light" ? "text-gray-900" : "text-white"}
  `;

  const modalMessageClasses = `
    text-sm font-medium mb-6
    ${theme === "light" ? "text-gray-700" : "text-gray-200"}
  `;

  const getBaseClasses = () => {
    switch (displayType) {
      case "modal":
        return modalBaseClasses;
      case "popup":
        return popupBaseClasses;
      default:
        return bannerBaseClasses;
    }
  };

  const getContentClasses = () => {
    switch (displayType) {
      case "modal":
        return modalContentClasses;
      case "popup":
        return popupContentClasses;
      default:
        return bannerContentClasses;
    }
  };

  const getTitleClasses = () => {
    switch (displayType) {
      case "modal":
        return modalTitleClasses;
      case "popup":
        return popupTitleClasses;
      default:
        return bannerTitleClasses;
    }
  };

  const getMessageClasses = () => {
    switch (displayType) {
      case "modal":
        return modalMessageClasses;
      case "popup":
        return popupMessageClasses;
      default:
        return bannerMessageClasses;
    }
  };

  const getButtonGroupClasses = () => {
    switch (displayType) {
      case "modal":
        return modalButtonGroupClasses;
      case "popup":
        return popupButtonGroupClasses;
      default:
        return bannerButtonGroupClasses;
    }
  };

  const renderContent = () => {
    if (displayType === "banner") {
      return (
        <div className="flex flex-col gap-4">
          <div>
            {title && <p className={getTitleClasses().trim()}>{title}</p>}
            <p className={getMessageClasses().trim()}>{message}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            {privacyPolicyUrl && (
              <a
                href={privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={privacyLinkClasses.trim()}
              >
                {privacyPolicyText}
              </a>
            )}
            <div className="flex items-center gap-3">
              {showManageButton && (
                <button
                  onClick={onManage}
                  className={manageButtonClasses.trim()}
                >
                  {manageButtonText}
                </button>
              )}
              <button
                onClick={handleDecline}
                className={declineButtonClasses.trim()}
              >
                {declineButtonText}
              </button>
              <button
                onClick={handleAccept}
                className={acceptButtonClasses.trim()}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col">
        {title && <p className={getTitleClasses().trim()}>{title}</p>}
        <p className={getMessageClasses().trim()}>{message}</p>
      </div>
    );
  };

  const renderButtons = () => {
    if (displayType === "popup") {
      return (
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDecline}
              className={declineButtonClasses.trim()}
            >
              {declineButtonText}
            </button>
            <button
              onClick={handleAccept}
              className={acceptButtonClasses.trim()}
            >
              {buttonText}
            </button>
          </div>
          <div className="flex flex-col gap-2 w-full">
            {showManageButton && (
              <button
                onClick={onManage}
                className={`${manageButtonClasses.trim()} w-full justify-center`}
              >
                {manageButtonText}
              </button>
            )}
            {privacyPolicyUrl && (
              <a
                href={privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={privacyLinkClasses.trim()}
              >
                {privacyPolicyText}
              </a>
            )}
          </div>
        </div>
      );
    }

    if (displayType === "modal") {
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {privacyPolicyUrl && (
              <a
                href={privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={privacyLinkClasses.trim()}
              >
                {privacyPolicyText}
              </a>
            )}
            <div className="flex items-center gap-3">
              {showManageButton && (
                <button
                  onClick={onManage}
                  className={manageButtonClasses.trim()}
                >
                  {manageButtonText}
                </button>
              )}
              <button
                onClick={handleDecline}
                className={declineButtonClasses.trim()}
              >
                {declineButtonText}
              </button>
              <button
                onClick={handleAccept}
                className={acceptButtonClasses.trim()}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const content = (
    <>
      <div className={getBaseClasses().trim()}>
        {displayType === "modal" ? (
          <div className={getContentClasses().trim()}>
            {renderContent()}
            {renderButtons()}
          </div>
        ) : (
          <div className={getContentClasses().trim()}>
            {renderContent()}
            {renderButtons()}
          </div>
        )}
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default CookieConsenter;
