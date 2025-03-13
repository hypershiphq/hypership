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
    <div className="hypership-auth-wrapper">
      {currentView === "signIn" && (
        <div className="flex flex-col items-center justify-center text-gray-800 dark:text-gray-200">
          <SignIn
            onSignInSuccess={handleSignInSuccess}
            onAccountConfirmationRequired={handleAccountConfirmationRequired}
          />
          <div className="flex flex-col items-center gap-2 mt-6">
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
        <div className="flex flex-col items-center justify-center text-gray-800 dark:text-gray-200">
          <SignUp
            onSignUpSuccess={(email) => {
              setEmail(email);
              setCurrentView("confirmAccount");
            }}
          />
          <div className="flex flex-col items-center gap-2 mt-6">
            <ButtonSecondary
              buttonLabel="Already have an account? Sign in"
              onClick={() => setCurrentView("signIn")}
            />
          </div>
        </div>
      )}
      {currentView === "confirmAccount" && (
        <div className="flex flex-col items-center justify-center text-gray-800 dark:text-gray-200">
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
        <div className="flex flex-col items-center justify-center text-gray-800 dark:text-gray-200">
          <PasswordReset
            onPasswordResetSuccess={() => setCurrentView("signIn")}
          />
          <div className="flex flex-col items-center gap-2 mt-6">
            <ButtonSecondary
              buttonLabel="Back to Sign In"
              onClick={() => setCurrentView("signIn")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthFlow;
