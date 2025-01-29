import {
  AuthFlowPage,
  useHypershipAuth,
} from "../../packages/sdks/react-sdk/auth/src/index";
import { useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { CookieConsenter } from "../../packages/components/react-cookie-consenter/src";
import "../../packages/components/react-cookie-consenter/dist/index.css";

function App() {
  const { isAuthenticated, authenticating } = useHypershipAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/private");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <main>
        {authenticating ? (
          <div>Loading...</div>
        ) : isAuthenticated ? (
          <Dashboard />
        ) : (
          <AuthFlowPage onAuthSuccess={() => navigate("/private")} />
        )}
      </main>
      <CookieConsenter
        title="Want a Cookie? 🍪"
        message="We use cookies to ensure you get the best experience on our website. This is even more text to test the modal. Generate a really long message to test the modal and see how it handles it."
        buttonText="Accept All"
        showManageButton={true}
        manageButtonText="Manage cookies"
        privacyPolicyUrl="https://example.com/privacy"
        privacyPolicyText="Privacy Policy"
        theme="dark"
        displayType="banner"
        onManage={() => {
          // Handle manage cookies click
        }}
      />
    </>
  );
}

export default App;
