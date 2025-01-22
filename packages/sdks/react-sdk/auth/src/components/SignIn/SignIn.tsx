import React, { useEffect, useState } from "react";
import { InputFieldPassword } from "../Common/InputFieldPassword/InputFieldPassword";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";

interface SignInProps {
  onSignInSuccess: () => void;
  onAccountConfirmationRequired?: (email: string) => void;
  buttonLabel?: string;
}

export const SignIn: React.FC<SignInProps> = ({
  onSignInSuccess,
  onAccountConfirmationRequired,
  buttonLabel = "Sign In",
}) => {
  const { signIn, isAuthenticated, error, signingIn, theme } =
    useHypershipAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    console.log("SignIn - Current error:", error);
    if (error === "Please confirm your email address before signing in.") {
      console.log("SignIn - Unconfirmed account detected, email:", email);
      onAccountConfirmationRequired && onAccountConfirmationRequired(email);
    }
  }, [error, email, onAccountConfirmationRequired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SignIn - Attempting sign in for email:", email);
    try {
      await signIn(email, password);
      if (isAuthenticated) {
        console.log("SignIn - Sign in successful");
        onSignInSuccess();
      }
    } catch (err: any) {
      console.log("SignIn - Sign in error:", err);
      // Error handling is now done through the error state
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      onSignInSuccess();
    }
  }, [isAuthenticated, onSignInSuccess]);

  return (
    <div className="hypership-container">
      <form className="hypership-form" onSubmit={handleSubmit}>
        <InputFieldEmail
          email={email}
          setEmail={setEmail}
          placeholder="Enter your email"
          label="Email"
          theme={theme}
        />
        <InputFieldPassword
          password={password}
          setPassword={setPassword}
          placeholder="Enter your password"
          label="Password"
          showStrengthMeter={false}
        />
        <ButtonPrimary
          buttonLabel={buttonLabel}
          type="submit"
          loading={signingIn}
        />
        <HypershipPoweredBy />
      </form>
    </div>
  );
};

export default SignIn;
