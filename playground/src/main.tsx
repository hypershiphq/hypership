import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HypershipAuthProvider } from "../../packages/sdks/react-sdk/auth/src/context/HypershipAuthProvider";
import { HypershipEventsProvider } from "../../packages/sdks/react-sdk/events/src/components/HypershipEventsProvider.tsx";
import { HypershipAnalyticsProvider } from "../../packages/sdks/react-sdk/analytics/src/components/HypershipAnalyticsProvider.tsx";

const HYPERSHIP_PUBLIC_KEY = "HS-459892402";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HypershipAuthProvider apiKey={HYPERSHIP_PUBLIC_KEY}>
      <HypershipEventsProvider apiKey={HYPERSHIP_PUBLIC_KEY}>
        <HypershipAnalyticsProvider apiKey={HYPERSHIP_PUBLIC_KEY} />
        <App />
      </HypershipEventsProvider>
    </HypershipAuthProvider>
  </StrictMode>
);
