import {
  AuthFlowPage,
  useHypershipAuth,
} from "../../packages/sdks/react-sdk/auth/src/index";

import Dashboard from "./Dashboard";

function App() {
  const { isAuthenticated, authenticating } = useHypershipAuth();
  return (
    <>
      {authenticating ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <Dashboard />
      ) : (
        <AuthFlowPage onAuthSuccess={() => console.log("signed in")} />
      )}
    </>
  );
}

export default App;
