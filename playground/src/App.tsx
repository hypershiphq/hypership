import {
  AuthFlowPage,
  useHypershipAuth,
} from "../../packages/sdks/react-sdk/auth/src/index";
import { useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import {
  CookieConsentProvider,
  useCookieConsent,
} from "../../packages/components/react-cookie-consenter/src";
import "../../packages/components/react-cookie-consenter/dist/index.css";

// Create a component that uses the cookie consent hook
function CookieSettings() {
  const { showConsentBanner } = useCookieConsent();

  return <button onClick={showConsentBanner}>Cookie Settings</button>;
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
    <CookieConsentProvider
      title="Want a Cookie? 🍪"
      message="We use cookies to ensure you get the best experience on our website. This is even more text to test the modal. Generate a really long message to test the modal and see how it handles it."
      buttonText="Accept All"
      showManageButton={true}
      manageButtonText="Manage cookies"
      privacyPolicyUrl="https://example.com/privacy"
      privacyPolicyText="Privacy Policy"
      theme="dark"
      displayType="modal"
      experimentallyBlockTracking={true}
      onManage={() => {
        // Handle manage cookies click
      }}
    >
      <AppContent />
    </CookieConsentProvider>
  );
}

export default App;
