import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { ButtonSecondary } from "../Common/ButtonSecondary/ButtonSecondary";
import { SignIn } from "../SignIn/SignIn";
import { Alert } from "../Common/Alert/Alert";

interface ConfirmUserAccountProps {
  onConfirmationSuccess: () => void;
  email?: string;
}

export const ConfirmUserAccount: React.FC<ConfirmUserAccountProps> = ({
  onConfirmationSuccess,
  email: initialEmail = "",
}) => {
  const {
    confirmAccount,
    error,
    confirmAccountCodeResend,
    confirmingAccount,
    confirmAccountCodeResending,
  } = useHypershipAuth();
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>(initialEmail);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage("Please enter a 6-digit code.");
      return;
    }

    try {
      await confirmAccount(email, otp);
      setShowSignIn(true);
      onConfirmationSuccess();
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error?.message ||
          "An error occurred during account confirmation."
      );
    }
  };

  if (showSignIn) {
    return <SignIn onSignInSuccess={onConfirmationSuccess} />;
  }

  return (
    <div className="hypership-container">
      <form className="hypership-form" onSubmit={handleSubmit}>
        <Alert message={errorMessage || error} type="error" />
        <InputFieldEmail
          email={email}
          setEmail={setEmail}
          placeholder="Enter your email"
          label="Email"
        />
        <div className="hypership-input-group">
          <Alert
            message="Enter the confirmation code sent to your email"
            type="success"
          />
          <OtpInput
            inputStyle="hypership-otp-button"
            value={otp}
            onChange={(otp) => handleOtpChange(otp)}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                style={{
                  fontSize: "1.25rem",
                  textAlign: "center",
                  border: "1px solid #e5e7eb", // Tailwind gray-200 for subtle border
                  backgroundColor: "#f3f4f6", // Tailwind gray-100
                  borderRadius: "4px",
                  padding: "16px",
                  margin: "0 4px",
                }}
              />
            )}
          />
        </div>
        <ButtonPrimary
          type="submit"
          buttonLabel="Confirm Account"
          loading={confirmingAccount}
        />
        <ButtonSecondary
          buttonLabel="Resend confirmation code"
          loading={confirmAccountCodeResending}
          onClick={() => confirmAccountCodeResend(email)}
        />
        <HypershipPoweredBy />
      </form>
    </div>
  );
};
