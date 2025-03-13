import { AuthFlowPage, useHypershipAuth } from "@hypership/auth-react";
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
        <AuthFlowPage
          initialView="confirmAccount"
          onAuthSuccess={() => navigate("/private")}
        />
      )}
    </main>
  );
}

function App() {
  return <AppContent />;
}

export default App;
