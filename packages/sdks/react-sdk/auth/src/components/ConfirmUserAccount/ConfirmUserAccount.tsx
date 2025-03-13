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
    <div className="hypership-container">
      <div className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Verify your account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter the code sent to your email
          </p>
        </div>

        <form
          className="hypership-form w-full p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
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

          <div className="mb-6 w-full">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmation code
            </label>
            <OtpInput
              containerStyle="flex justify-between"
              value={otp}
              onChange={(otp) => handleOtpChange(otp)}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  className="w-[40px] h-[40px] text-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-lg shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-dark/20 focus:border-primary dark:focus:border-primary-dark"
                />
              )}
            />
          </div>

          <div className="space-y-4">
            <ButtonPrimary
              type="submit"
              buttonLabel="Verify Account"
              loading={confirmingAccount}
            />
            <div className="text-center">
              <ButtonSecondary
                buttonLabel="Resend confirmation code"
                loading={confirmAccountCodeResending}
                onClick={() => confirmAccountCodeResend(email)}
              />
            </div>
          </div>

          <HypershipPoweredBy />
        </form>
      </div>
    </div>
  );
};
