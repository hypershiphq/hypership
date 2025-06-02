"use client";

import { AuthFlowPage } from "@hypership/auth-react";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          ← Back to Database Tests
        </Link>
      </div>

      <AuthFlowPage
        title="🚀 Hypership Auth"
        onAuthSuccess={() => {
          console.log("Auth success");
          // Redirect to main page after successful auth
          window.location.href = "/";
        }}
        rightComponent={
          <div className="text-white p-8">
            <h2 className="text-3xl font-bold mb-4">Welcome to Hypership</h2>
            <p className="text-lg mb-6">
              Sign in to access the database playground where you can test CRUD
              operations with automatic user tracking.
            </p>
            <ul className="space-y-2 text-sm">
              <li>✅ Fluent API syntax</li>
              <li>✅ TypeScript support</li>
              <li>✅ Automatic user tracking</li>
              <li>✅ Server-side operations</li>
            </ul>
          </div>
        }
        backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
        highlightColor="#3b82f6"
      />
    </div>
  );
}
