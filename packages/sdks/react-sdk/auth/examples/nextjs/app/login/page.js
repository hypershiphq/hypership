"use client";

import { useState } from "react";
import { AuthFlow, ThemeToggle } from "@hypership/auth-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    // Navigate to dashboard when auth is successful
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
        <h1 className="text-xl font-bold">My Next.js Application</h1>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex justify-center items-center p-4">
        {/* The wrapper is now automatically included in the HypershipAuthProvider */}
        <AuthFlow onAuthSuccess={handleAuthSuccess} />
      </main>

      <footer className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
        © {new Date().getFullYear()} My Next.js Application
      </footer>
    </div>
  );
}
