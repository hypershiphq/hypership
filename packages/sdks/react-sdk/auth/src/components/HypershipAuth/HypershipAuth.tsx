import React, { useState } from "react";
import SignIn from "../SignIn/SignIn";
import { ConfirmUserAccount } from "../ConfirmUserAccount/ConfirmUserAccount";
import { PasswordReset } from "../PasswordReset/PasswordReset";
import { ButtonSecondary } from "../Common/ButtonSecondary/ButtonSecondary";
import { SignUp } from "../SignUp/SignUp";

// Props for HypershipAuth
interface HypershipAuthProps {
  onAuthSuccess: () => void;
}

export const HypershipAuth: React.FC<HypershipAuthProps> = ({
  onAuthSuccess,
}) => {
  const [currentView, setCurrentView] = useState<
    "signIn" | "signUp" | "confirmAccount" | "passwordReset"
  >("signIn");
  const [email, setEmail] = useState<string>("");

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
        <>
          <SignIn
            onSignInSuccess={handleSignInSuccess}
            onAccountConfirmationRequired={handleAccountConfirmationRequired}
          />
          <ButtonSecondary
            buttonLabel="Don't have an account? Sign up"
            onClick={() => setCurrentView("signUp")}
          />
          <ButtonSecondary
            buttonLabel="Forgot Password?"
            onClick={handleForgotPassword}
          />
        </>
      )}
      {currentView === "signUp" && (
        <>
          <SignUp
            onSignUpSuccess={(email) => {
              setEmail(email);
              setCurrentView("confirmAccount");
            }}
          />
          <ButtonSecondary
            buttonLabel="Already have an account? Sign in"
            onClick={() => setCurrentView("signIn")}
          />
        </>
      )}
      {currentView === "confirmAccount" && (
        <ConfirmUserAccount
          email={email}
          onConfirmationSuccess={() => {
            setCurrentView("signIn");
            handleSignInSuccess();
          }}
        />
      )}
      {currentView === "passwordReset" && (
        <>
          <PasswordReset
            onPasswordResetSuccess={() => setCurrentView("signIn")}
          />
          <ButtonSecondary
            buttonLabel="Back to Sign In"
            onClick={() => setCurrentView("signIn")}
          />
        </>
      )}
    </>
  );
};

export default HypershipAuth;
