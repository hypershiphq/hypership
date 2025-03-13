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
    } catch (err: any) {}
  };

  if (showSignIn) {
    return <SignIn onSignInSuccess={onConfirmationSuccess} />;
  }

  return (
    <div className="min-w-[400px] flex justify-center items-center rounded-lg bg-transparent">
      <form
        className="w-full p-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <Alert message={errorMessage || error} type="error" />
        <InputFieldEmail
          email={email}
          setEmail={setEmail}
          placeholder="Enter your email"
          label="Email"
        />
        <div className="mb-4 w-full">
          <Alert
            message="Enter the confirmation code sent to your email"
            type="success"
          />
          <OtpInput
            containerStyle="flex justify-between mt-4"
            value={otp}
            onChange={(otp) => handleOtpChange(otp)}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                className="text-xl text-center border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded p-4 mx-1 w-12 h-12 focus:border-primary dark:focus:border-primary-dark focus:outline-none text-gray-800 dark:text-gray-200"
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
