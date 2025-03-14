import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@hypership/auth-react/style.css";
import App from "./App.tsx";
import { HypershipAuthProvider } from "@hypership/auth-react";
import { HypershipEventsProvider } from "../../packages/sdks/react-sdk/events/src/components/HypershipEventsProvider.tsx";
import { HypershipAnalyticsProvider } from "../../packages/sdks/react-sdk/analytics/src/components/HypershipAnalyticsProvider.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HypershipAuthProvider apiKey="HS-108466945">
        <HypershipEventsProvider>
          <HypershipAnalyticsProvider />
          <App />
        </HypershipEventsProvider>
      </HypershipAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
