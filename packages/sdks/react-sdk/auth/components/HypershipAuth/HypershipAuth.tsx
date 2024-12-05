import React, { useState } from "react";
import SignIn from "../SignIn/SignIn";
import { ConfirmUserAccount } from "../ConfirmUserAccount/ConfirmUserAccount";
import PasswordReset from "../PasswordReset/PasswordReset";
import ButtonSecondary from "../Common/ButtonSecondary/ButtonSecondary";
import { SignUp } from "../SignUp/SignUp";

// Props for HypershipAuth
interface HypershipAuthProps {
  onAuthSuccess: () => void;
  unstyled?: boolean;
}

export const HypershipAuth: React.FC<HypershipAuthProps> = ({
  onAuthSuccess,
  unstyled = false,
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
            unstyled={unstyled}
          />
          <ButtonSecondary
            buttonLabel="Don't have an account? Sign up"
            onClick={() => setCurrentView("signUp")}
            unstyled={unstyled}
          />
          <ButtonSecondary
            buttonLabel="Forgot Password?"
            onClick={handleForgotPassword}
            unstyled={unstyled}
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
            unstyled={unstyled}
          />
          <ButtonSecondary
            buttonLabel="Already have an account? Sign in"
            onClick={() => setCurrentView("signIn")}
            unstyled={unstyled}
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
          unstyled={unstyled}
        />
      )}
      {currentView === "passwordReset" && (
        <>
          <PasswordReset
            onPasswordResetSuccess={() => setCurrentView("signIn")}
            unstyled={unstyled}
          />
          <ButtonSecondary
            buttonLabel="Back to Sign In"
            onClick={() => setCurrentView("signIn")}
            unstyled={unstyled}
          />
        </>
      )}
    </>
  );
};

export default HypershipAuth;
