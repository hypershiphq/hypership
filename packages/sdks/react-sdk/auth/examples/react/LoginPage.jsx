import React, { useState } from "react";
import {
  AuthFlow,
  HypershipAuthProvider,
  useTheme,
  ThemeToggle,
} from "@hypership/auth-react";

// Import the styles (this should be in your app's entry point)
import "@hypership/auth-react/style.css";

function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    // Navigate to dashboard or other protected page
    // For example: router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
        <h1 className="text-xl font-bold">My Application</h1>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex justify-center items-center p-4">
        {isAuthenticated ? (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <p>You are now authenticated.</p>
          </div>
        ) : (
          // The wrapper is now automatically included in the HypershipAuthProvider
          <AuthFlow onAuthSuccess={handleAuthSuccess} />
        )}
      </main>

      <footer className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
        © {new Date().getFullYear()} My Application
      </footer>
    </div>
  );
}

// The root component where you provide the auth context
function App() {
  return (
    <HypershipAuthProvider apiKey="your-hypership-api-key">
      <LoginPage />
    </HypershipAuthProvider>
  );
}

export default App;
