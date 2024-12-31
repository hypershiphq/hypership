import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HypershipAuthProvider } from "../../packages/sdks/react-sdk/auth/src/context/HypershipAuthProvider";
import { HypershipEventsProvider } from "../../packages/sdks/react-sdk/events/src/components/HypershipEventsProvider.tsx";
import { HypershipAnalyticsProvider } from "../../packages/sdks/react-sdk/analytics/src/components/HypershipAnalyticsProvider.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HypershipAuthProvider>
        <HypershipEventsProvider>
          <HypershipAnalyticsProvider />
          <App />
        </HypershipEventsProvider>
      </HypershipAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
