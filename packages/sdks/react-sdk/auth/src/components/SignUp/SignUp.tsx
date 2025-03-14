import React, { useState } from "react";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";
import { InputFieldPassword } from "../Common/InputFieldPassword/InputFieldPassword";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";
import { Alert } from "../Common/Alert/Alert";

interface SignUpProps {
  onSignUpSuccess: (email: string) => void;
  highlightColor?: string;
}

export const SignUp: React.FC<SignUpProps> = ({
  onSignUpSuccess,
  highlightColor,
}) => {
  const { signUp, error, signingUp } = useHypershipAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await signUp(email, password);
      onSignUpSuccess(email);
      setErrorMessage(null);
    } catch (err: any) {
      // Error is handled in the AuthContext
    }
  };

  return (
    <div className="hypership-container">
      <div className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Create account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign up to get started
          </p>
        </div>

        <form
          className="hypership-form w-full bg-white dark:bg-transparent p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
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
          />
          <InputFieldPassword
            password={password}
            setPassword={setPassword}
            placeholder="Create a password"
            label="Password"
            onChange={handlePasswordChange}
          />
          <InputFieldPassword
            id="confirm-password"
            password={confirmPassword}
            setPassword={setConfirmPassword}
            placeholder="Confirm your password"
            label="Confirm Password"
            showStrengthMeter={false}
          />
          <ButtonPrimary
            buttonLabel="Create Account"
            type="submit"
            loading={signingUp}
            highlightColor={highlightColor}
          />
          <HypershipPoweredBy />
        </form>
      </div>
    </div>
  );
};
