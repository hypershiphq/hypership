import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { HypershipAuthProvider } from "./@hypership/auth-react/context/HypershipAuthProvider";
import { SignUp } from "./@hypership/auth-react/components/SignUp/SignUp";
import { HypershipEvents } from "./@hypership/events-react/components/HypershipEvents";
import Dashboard from "./Dashboard";
import { HypershipAnalytics } from "./@hypership/analytics-react/components/HypershipAnalytics";
import SignInPage from "./SignInPage";
import PasswordReset from "./@hypership/auth-react/components/PasswordReset/PasswordReset";
import Private from "./@hypership/auth-react/components/Private/Private";
import PasswordChange from "./@hypership/auth-react/components/PasswordChange/PasswordChange";
import HypershipAuth from "./@hypership/auth-react/components/HypershipAuth/HypershipAuth";
import HypershipAuthPage from "./@hypership/auth-react/components/HypershipAuthPage/HypershipAuthPage";
import EventTest from "./EventTest";
import Landing from "./Landing";

const HYPERSHIP_PUBLIC_KEY = "HS-674634384";

function App() {
  return (
    <HypershipAuthProvider apiKey={HYPERSHIP_PUBLIC_KEY}>
      <HypershipEvents apiKey={HYPERSHIP_PUBLIC_KEY}>
        <Router>
          <HypershipAnalytics apiKey={HYPERSHIP_PUBLIC_KEY} />
          <div className="App">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/dashboard"
                element={
                  <Private
                    onUnauthorized={() => (window.location.href = "/signin")}
                  >
                    <Dashboard />
                  </Private>
                }
              />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/events" element={<EventTest />} />
              <Route
                path="/auth"
                element={
                  <HypershipAuth
                    onAuthSuccess={() => console.log("Auth success")}
                  />
                }
              />
              <Route
                path="/auth-page"
                element={
                  <HypershipAuthPage
                    // rightComponent={<div>Right Side</div>}
                    backgroundImage="https://images.unsplash.com/photo-1503328427499-d92d1ac3d174?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    onAuthSuccess={() => console.log("Auth success")}
                  />
                }
              />
              <Route
                path="/signup"
                element={
                  <SignUp
                    onSignUpSuccess={() =>
                      console.log(
                        "✅ Successfully signed up! Please check your email for confirmation code."
                      )
                    }
                  />
                }
              />
              <Route
                path="/forgot"
                element={
                  <PasswordReset
                    onPasswordResetSuccess={() => console.log("signed up")}
                  />
                }
              />
              <Route
                path="/change-password"
                element={
                  <PasswordChange
                    onPasswordChangeSuccess={() => console.log("signed up")}
                  />
                }
              />
            </Routes>
          </div>
        </Router>
      </HypershipEvents>
    </HypershipAuthProvider>
  );
}

export default App;
