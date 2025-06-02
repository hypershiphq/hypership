"use client";

import { ReactNode } from "react";
import { HypershipAuthProvider } from "@hypership/auth-react";
import "@hypership/auth-react/style.css";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <HypershipAuthProvider apiKey="HS-335662300">
      {children}
    </HypershipAuthProvider>
  );
}
