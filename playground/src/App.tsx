import {
  AuthFlowPage,
  useHypershipAuth,
} from "../../packages/sdks/react-sdk/auth/src/index";
import { useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";

function AppContent() {
  const { isAuthenticated, authenticating } = useHypershipAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/private");
    }
  }, [isAuthenticated, navigate]);

  return (
    <main>
      {authenticating ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <Dashboard />
      ) : (
        <AuthFlowPage onAuthSuccess={() => navigate("/private")} />
      )}
    </main>
  );
}

function App() {
  return <AppContent />;
}

export default App;
