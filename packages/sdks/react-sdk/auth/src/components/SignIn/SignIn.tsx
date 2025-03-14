import React, { useEffect, useState } from "react";
import { InputFieldPassword } from "../Common/InputFieldPassword/InputFieldPassword";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";
import { Alert } from "../Common/Alert/Alert";

interface SignInProps {
  onSignInSuccess: () => void;
  onAccountConfirmationRequired?: (email: string) => void;
  onForgotPassword?: () => void;
  buttonLabel?: string;
  highlightColor?: string;
}

export const SignIn: React.FC<SignInProps> = ({
  onSignInSuccess,
  onAccountConfirmationRequired,
  onForgotPassword,
  buttonLabel = "Sign In",
  highlightColor,
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
    <div className="hypership-container">
      <div className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign in to your account to continue
          </p>
        </div>

        <form
          className="hypership-form w-full p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
          onSubmit={handleSubmit}
        >
          {(errorMessage || error) && (
            <Alert message={errorMessage || error} type="error" />
          )}

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
          <div className="mb-4 text-left">
            <button
              type="button"
              onClick={() => onForgotPassword && onForgotPassword()}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium"
            >
              Forgot Password?
            </button>
          </div>
          <ButtonPrimary
            buttonLabel={buttonLabel}
            type="submit"
            loading={signingIn}
            highlightColor={highlightColor}
          />
          <HypershipPoweredBy />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
