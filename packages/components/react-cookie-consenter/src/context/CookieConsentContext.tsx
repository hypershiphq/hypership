import React, { createContext, useContext, useState, useEffect } from "react";
import CookieConsenter from "../components/CookieConsenter";
import type { CookieConsenterProps } from "../types/types";

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
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsent, setHasConsent] = useState<boolean | null>(() => {
    const consent = localStorage.getItem(cookieName);
    return consent === "true" ? true : consent === "false" ? false : null;
  });

  useEffect(() => {
    // Show banner if no consent decision has been made
    if (hasConsent === null) {
      setIsVisible(true);
    }
  }, [hasConsent]);

  const showConsentBanner = () => {
    console.log("showConsentBanner");
    // Reset consent state to force banner to show
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
