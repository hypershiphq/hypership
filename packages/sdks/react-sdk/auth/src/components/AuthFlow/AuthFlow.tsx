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
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 sm:p-6">
      {currentView === "signIn" && (
        <div className="w-full space-y-6 opacity-0 transform translate-y-2 animate-[fadeIn_0.5s_ease-in-out_forwards]">
          <SignIn
            onSignInSuccess={handleSignInSuccess}
            onAccountConfirmationRequired={handleAccountConfirmationRequired}
          />
          <div className="flex flex-col items-center gap-2">
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
        <div className="w-full space-y-6 opacity-0 transform translate-y-2 animate-[fadeIn_0.5s_ease-in-out_forwards]">
          <SignUp
            onSignUpSuccess={(email) => {
              setEmail(email);
              setCurrentView("confirmAccount");
            }}
          />
          <div className="flex flex-col items-center gap-2">
            <ButtonSecondary
              buttonLabel="Already have an account? Sign in"
              onClick={() => setCurrentView("signIn")}
            />
          </div>
        </div>
      )}
      {currentView === "confirmAccount" && (
        <div className="w-full space-y-6 opacity-0 transform translate-y-2 animate-[fadeIn_0.5s_ease-in-out_forwards]">
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
        <div className="w-full space-y-6 opacity-0 transform translate-y-2 animate-[fadeIn_0.5s_ease-in-out_forwards]">
          <PasswordReset
            onPasswordResetSuccess={() => setCurrentView("signIn")}
          />
          <div className="flex flex-col items-center gap-2">
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
