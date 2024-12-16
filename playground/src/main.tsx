import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HypershipAuthProvider } from "../../packages/sdks/react-sdk/auth/src/context/HypershipAuthProvider";

const HYPERSHIP_PUBLIC_KEY = "HS-459892402";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HypershipAuthProvider apiKey={HYPERSHIP_PUBLIC_KEY}>
      <App />
    </HypershipAuthProvider>
  </StrictMode>
);
