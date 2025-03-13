import React, { useState, useEffect } from "react";
import SignIn from "../SignIn/SignIn";
import { ConfirmUserAccount } from "../ConfirmUserAccount/ConfirmUserAccount";
import { PasswordReset } from "../PasswordReset/PasswordReset";
import { SignUp } from "../SignUp/SignUp";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";

// Props for AuthFlow
interface AuthFlowProps {
  onAuthSuccess: () => void;
  initialView?: "signIn" | "signUp" | "confirmAccount" | "passwordReset";
  /** Optional email to pre-populate for confirmAccount or passwordReset views */
  initialEmail?: string;
  /** Optional highlight color to use for buttons and links */
  highlightColor?: string;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({
  onAuthSuccess,
  initialView = "signIn",
  initialEmail = "",
  highlightColor,
}) => {
  const [currentView, setCurrentView] = useState<
    "signIn" | "signUp" | "confirmAccount" | "passwordReset"
  >(initialView);
  const { error } = useHypershipAuth();
  const [email, setEmail] = useState<string>(initialEmail);

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
            onForgotPassword={handleForgotPassword}
            highlightColor={highlightColor}
          />
          <div className="flex flex-col w-full">
            <button
              onClick={() => setCurrentView("signUp")}
              className="text-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Don't have an account?{" "}
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                Sign up
              </span>
            </button>
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
            highlightColor={highlightColor}
          />
          <div className="w-full">
            <button
              onClick={() => setCurrentView("signIn")}
              className="text-center w-full text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Already have an account?{" "}
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                Sign in
              </span>
            </button>
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
            highlightColor={highlightColor}
          />
        </div>
      )}
      {currentView === "passwordReset" && (
        <div className="w-full space-y-6 opacity-0 transform translate-y-2 animate-[fadeIn_0.5s_ease-in-out_forwards]">
          <PasswordReset
            onPasswordResetSuccess={() => setCurrentView("signIn")}
            highlightColor={highlightColor}
          />
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setCurrentView("signIn")}
              className="text-center w-full text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthFlow;
