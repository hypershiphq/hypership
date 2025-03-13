import { HypershipAuthProvider } from "@hypership/auth-react";

// Import the styles at the app level
import "@hypership/auth-react/style.css";

// Import your global styles
import "./globals.css";

export const metadata = {
  title: "My App with Hypership Auth",
  description: "Example application using Hypership Auth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <HypershipAuthProvider
          apiKey={process.env.NEXT_PUBLIC_HYPERSHIP_API_KEY}
        >
          {children}
        </HypershipAuthProvider>
      </body>
    </html>
  );
}
