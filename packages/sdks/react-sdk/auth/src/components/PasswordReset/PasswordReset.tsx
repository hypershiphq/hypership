import React, { useState } from "react";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";
import { PasswordChange } from "../PasswordChange/PasswordChange";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { Alert } from "../Common/Alert/Alert";

// Props interface that accepts the callback from the parent
interface PasswordResetProps {
  onPasswordResetSuccess: () => void;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({
  onPasswordResetSuccess,
}) => {
  const { passwordReset, passwordResetting } = useHypershipAuth();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await passwordReset(email);
      setMessage("Password reset instructions have been sent to your email.");
      setErrorMessage(null);
      setShowPasswordChange(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error.message ||
          "An error occurred during password reset."
      );
      setMessage(null);
    }
  };

  if (showPasswordChange) {
    return (
      <PasswordChange
        onPasswordChangeSuccess={onPasswordResetSuccess}
        email={email}
      />
    );
  }

  return (
    <div className="hypership-container">
      <div className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Reset password
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            We'll send you instructions to reset your password
          </p>
        </div>

        <form
          className="hypership-form w-full p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
          onSubmit={handleSubmit}
        >
          {errorMessage && <Alert message={errorMessage} type="error" />}
          {message && <Alert message={message} type="success" />}

          <InputFieldEmail
            email={email}
            setEmail={setEmail}
            placeholder="Enter your email"
            label="Email"
          />
          <ButtonPrimary
            buttonLabel="Reset Password"
            type="submit"
            loading={passwordResetting}
          />
          <HypershipPoweredBy />
        </form>
      </div>
    </div>
  );
};
