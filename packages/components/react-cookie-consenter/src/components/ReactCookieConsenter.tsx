import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CookieConsenterProps } from "../types/types";

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
  onAccept,
  onDecline,
  onManage,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const hasConsent = localStorage.getItem(cookieName);
    if (!hasConsent) {
      setIsVisible(true);
      setTimeout(() => {
        setIsEntering(false);
      }, 50);
    }
  }, [cookieName]);

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

  if (!isVisible) return null;

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
  );

  return createPortal(content, document.body);
};

export default CookieConsenter;
