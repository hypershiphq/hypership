import {
  AuthFlowPage,
  useHypershipAuth,
} from "../../packages/sdks/react-sdk/auth/src/index";
import { useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import {
  CookieManager,
  useCookieConsent,
} from "../../packages/components/react-cookie-manager/src";
import "../../packages/components/react-cookie-manager/dist/style.css";

// Create a component that uses the cookie consent hook and displays detailed status
function CookieSettings() {
  const { showConsentBanner, detailedConsent } = useCookieConsent();

  return (
    <div className="flex flex-col gap-4">
      <button onClick={showConsentBanner} className="">
        Cookie Settings
      </button>

      {detailedConsent && (
        <div className="text-sm">
          <h4 className="font-semibold mb-2">Current Cookie Preferences:</h4>
          <ul className="space-y-1">
            <li>
              Analytics:{" "}
              {detailedConsent.Analytics.consented
                ? "✅ Enabled"
                : "❌ Disabled"}
            </li>
            <li>
              Social:{" "}
              {detailedConsent.Social.consented ? "✅ Enabled" : "❌ Disabled"}
            </li>
            <li>
              Advertising:{" "}
              {detailedConsent.Advertising.consented
                ? "✅ Enabled"
                : "❌ Disabled"}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

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

function AppContent() {
  const { isAuthenticated, authenticating } = useHypershipAuth();
  const { hasConsent } = useCookieConsent();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/private");
    }
  }, [isAuthenticated, navigate]);

  return (
    <main>
      {/* {authenticating ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <Dashboard />
      ) : (
        <AuthFlowPage onAuthSuccess={() => navigate("/private")} />
      )} */}
      <div>
        Cookies consent status:{" "}
        {hasConsent === null ? "Not set" : hasConsent ? "Accepted" : "Declined"}
      </div>
      <CookieSettings />
      <TestButton />
    </main>
  );
}

function App() {
  return (
    <CookieManager
      title="Would You Like A Cookie? 🍪"
      message="We value your privacy. Choose which cookies you want to allow. Essential cookies are always enabled as they are necessary for the website to function properly."
      buttonText="Accept All"
      declineButtonText="Decline All"
      showManageButton={true}
      manageButtonText="Manage Cookies"
      privacyPolicyUrl="https://example.com/privacy"
      privacyPolicyText="Privacy Policy"
      theme="light"
      displayType="popup"
      onManage={(preferences) => {
        if (preferences) {
          console.log("Cookie preferences updated:", preferences);
        }
      }}
    >
      <AppContent />
    </CookieManager>
  );
}

export default App;
