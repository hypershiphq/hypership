import React, { useEffect, useState } from "react";
import { InputFieldPassword } from "../Common/InputFieldPassword/InputFieldPassword";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { Alert } from "../Common/Alert/Alert";
import { ButtonSignInGitHub } from "../Common/ButtonSignInGitHub/ButtonSignInGitHub";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      if (isAuthenticated) {
        onSignInSuccess();
      }
    } catch (err: any) {
      if (
        err?.error?.code === "SIGN_IN_FAILED" &&
        err?.error?.message === "User is not confirmed."
      ) {
        // Trigger the function prop to handle unconfirmed users
        onAccountConfirmationRequired && onAccountConfirmationRequired(email);
      }
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
        <Alert message={error} type="error" />
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
        {/* <ButtonSignInGitHub buttonLabel="Sign In with GitHub" /> */}
        <HypershipPoweredBy />
      </form>
    </div>
  );
};

export default SignIn;
