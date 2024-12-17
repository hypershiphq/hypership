import {
  AuthFlowPage,
  useHypershipAuth,
} from "../../packages/sdks/react-sdk/auth/src/index";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

function App() {
  const { isAuthenticated, authenticating } = useHypershipAuth();
  return (
    <BrowserRouter>
      {authenticating ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <Dashboard />
      ) : (
        <AuthFlowPage onAuthSuccess={() => console.log("signed in")} />
      )}
    </BrowserRouter>
  );
}

export default App;
