import React, { useState } from "react";
import { CookieCategories } from "../types/types";

interface ManageConsentProps {
  theme?: "light" | "dark";
  onSave: (categories: CookieCategories) => void;
  onCancel?: () => void;
  initialPreferences?: CookieCategories;
}

export const ManageConsent: React.FC<ManageConsentProps> = ({
  theme = "light",
  onSave,
  onCancel,
  initialPreferences = {
    Analytics: false,
    Social: false,
    Advertising: false,
  },
}) => {
  const [consent, setConsent] = useState<CookieCategories>(initialPreferences);

  const handleToggle = (category: keyof CookieCategories) => {
    setConsent((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    onSave(consent);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3
          className={`text-lg font-semibold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}
        >
          Cookie Preferences
        </h3>
        <p
          className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-200"}`}
        >
          Manage your cookie preferences below. Essential cookies are always
          enabled as they are necessary for the website to function properly.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Essential Cookies - Always enabled */}
        <div className="flex items-center justify-between">
          <div>
            <h4
              className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              Essential
            </h4>
            <p
              className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
            >
              Required for the website to function properly
            </p>
          </div>
          <div
            className={`px-3 py-1 text-xs font-medium rounded-full ${theme === "light" ? "bg-gray-100 text-gray-600" : "bg-gray-800 text-gray-300"}`}
          >
            Always On
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="flex items-center justify-between">
          <div>
            <h4
              className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              Analytics
            </h4>
            <p
              className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
            >
              Help us understand how visitors interact with our website
            </p>
          </div>
          <button
            onClick={() => handleToggle("Analytics")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              consent.Analytics
                ? "bg-blue-500"
                : theme === "light"
                  ? "bg-gray-200"
                  : "bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                consent.Analytics ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Social Cookies */}
        <div className="flex items-center justify-between">
          <div>
            <h4
              className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              Social
            </h4>
            <p
              className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
            >
              Enable social media features and sharing
            </p>
          </div>
          <button
            onClick={() => handleToggle("Social")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              consent.Social
                ? "bg-blue-500"
                : theme === "light"
                  ? "bg-gray-200"
                  : "bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                consent.Social ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Advertising Cookies */}
        <div className="flex items-center justify-between">
          <div>
            <h4
              className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              Advertising
            </h4>
            <p
              className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
            >
              Personalize advertisements and measure their performance
            </p>
          </div>
          <button
            onClick={() => handleToggle("Advertising")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              consent.Advertising
                ? "bg-blue-500"
                : theme === "light"
                  ? "bg-gray-200"
                  : "bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                consent.Advertising ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={handleSave}
          className="flex-1 px-3 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Preferences
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className={`flex-1 px-3 py-2.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              theme === "light"
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
