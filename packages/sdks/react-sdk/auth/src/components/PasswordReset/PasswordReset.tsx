import React, { useState } from "react";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";
import sharedStyles from "../AuthComponents.module.css";
import { PasswordChange } from "../PasswordChange/PasswordChange";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { Alert } from "../Common/Alert/Alert";

// Props interface that accepts the callback from the parent
interface PasswordResetProps {
  onPasswordResetSuccess: () => void;
  unstyled?: boolean;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({
  onPasswordResetSuccess,
  unstyled = false,
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
        unstyled={unstyled}
        email={email}
      />
    );
  }

  return (
    <div className={unstyled ? "" : sharedStyles["hypership-container"]}>
      <form
        className={unstyled ? "" : sharedStyles["hypership-form"]}
        onSubmit={handleSubmit}
      >
        <Alert message={errorMessage} type="error" unstyled={unstyled} />
        <Alert message={message} type="success" unstyled={unstyled} />
        <InputFieldEmail
          email={email}
          setEmail={setEmail}
          placeholder="Enter your email"
          label="Email"
          unstyled={unstyled}
        />
        <ButtonPrimary
          buttonLabel="Reset Password"
          type="submit"
          unstyled={unstyled}
          loading={passwordResetting}
        />
        <HypershipPoweredBy />
      </form>
    </div>
  );
};
