import React, { useState, useEffect } from "react";
import SignIn from "../SignIn/SignIn";
import { ConfirmUserAccount } from "../ConfirmUserAccount/ConfirmUserAccount";
import { PasswordReset } from "../PasswordReset/PasswordReset";
import { ButtonSecondary } from "../Common/ButtonSecondary/ButtonSecondary";
import { SignUp } from "../SignUp/SignUp";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";

// Props for AuthFlow
interface AuthFlowProps {
  onAuthSuccess: () => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState<
    "signIn" | "signUp" | "confirmAccount" | "passwordReset"
  >("signIn");
  const { error } = useHypershipAuth();
  const [email, setEmail] = useState<string>("");

  console.log("@hypership/auth-react version:", "0.0.11");

  useEffect(() => {
    if (error === "Please confirm your email address before signing in.") {
      setCurrentView("confirmAccount");
    }
  }, [error]);

  // Function to handle successful sign-in
  const handleSignInSuccess = () => {
    onAuthSuccess();
  };

  // Function to handle the case where user confirmation is required
  const handleAccountConfirmationRequired = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentView("confirmAccount");
  };

  // Function to handle password reset initiation
  const handleForgotPassword = () => {
    setCurrentView("passwordReset");
  };

  // Return the appropriate component based on currentView state
  return (
    <>
      {currentView === "signIn" && (
        <div className="hypership-auth-wrapper">
          <SignIn
            onSignInSuccess={handleSignInSuccess}
            onAccountConfirmationRequired={handleAccountConfirmationRequired}
          />
          <div className="hypership-button-group">
            <ButtonSecondary
              buttonLabel="Don't have an account? Sign up"
              onClick={() => setCurrentView("signUp")}
            />
            <ButtonSecondary
              buttonLabel="Forgot Password?"
              onClick={handleForgotPassword}
            />
          </div>
        </div>
      )}
      {currentView === "signUp" && (
        <div className="hypership-auth-wrapper">
          <SignUp
            onSignUpSuccess={(email) => {
              setEmail(email);
              setCurrentView("confirmAccount");
            }}
          />
          <div className="hypership-button-group">
            <ButtonSecondary
              buttonLabel="Already have an account? Sign in"
              onClick={() => setCurrentView("signIn")}
            />
          </div>
        </div>
      )}
      {currentView === "confirmAccount" && (
        <div className="hypership-auth-wrapper">
          <ConfirmUserAccount
            email={email}
            onConfirmationSuccess={() => {
              setCurrentView("signIn");
              handleSignInSuccess();
            }}
          />
        </div>
      )}
      {currentView === "passwordReset" && (
        <div className="hypership-auth-wrapper">
          <PasswordReset
            onPasswordResetSuccess={() => setCurrentView("signIn")}
          />
          <div className="hypership-button-group">
            <ButtonSecondary
              buttonLabel="Back to Sign In"
              onClick={() => setCurrentView("signIn")}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AuthFlow;
