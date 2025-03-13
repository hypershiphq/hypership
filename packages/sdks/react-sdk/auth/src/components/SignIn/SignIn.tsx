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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error === "Please confirm your email address before signing in.") {
      onAccountConfirmationRequired && onAccountConfirmationRequired(email);
    }
  }, [error, email, onAccountConfirmationRequired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      await signIn(email, password);
      onSignInSuccess();
      setErrorMessage(null);
    } catch (err: any) {
      // Error handling is already done in the auth context
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      onSignInSuccess();
    }
  }, [isAuthenticated, onSignInSuccess]);

  return (
    <div className="min-w-[400px] flex justify-center items-center rounded-lg bg-transparent">
      <form
        className="w-full p-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
        onSubmit={handleSubmit}
      >
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
