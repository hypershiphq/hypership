import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";
import sharedStyles from "../AuthComponents.module.css";
import ButtonPrimary from "../Common/ButtonPrimary/ButtonPrimary";
import InputFieldEmail from "../Common/InputFieldEmail/InputFieldEmail";
import InputFieldPassword from "../Common/InputFieldPassword/InputFieldPassword";
import HypershipPoweredBy from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import Alert from "../Common/Alert/Alert";

interface PasswordChangeProps {
  onPasswordChangeSuccess: () => void;
  unstyled?: boolean;
  email?: string;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({
  onPasswordChangeSuccess,
  unstyled = false,
  email: initialEmail = "",
}) => {
  const { confirmPasswordResetCode, passwordChange, error, passwordChanging } =
    useHypershipAuth();
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>(initialEmail);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
  };

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const changePasswordToken = await confirmPasswordResetCode(email, otp);
      await passwordChange(email, newPassword, changePasswordToken);
      onPasswordChangeSuccess();
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error.message ||
          "An error occurred during password reset."
      );
    }
  };

  return (
    <div className={unstyled ? "" : sharedStyles["hypership-container"]}>
      <form
        className={unstyled ? "" : sharedStyles["hypership-form"]}
        onSubmit={handleSubmit}
      >
        <Alert
          message={errorMessage || error}
          type="error"
          unstyled={unstyled}
        />
        <InputFieldEmail
          email={email}
          setEmail={setEmail}
          placeholder="Enter your email"
          label="Email"
          unstyled={unstyled}
        />
        <div className={unstyled ? "" : sharedStyles["hypership-input-group"]}>
          <Alert
            message="Enter the confirmation code sent to your email"
            type="success"
            unstyled={unstyled}
          />
          <OtpInput
            inputStyle="hypership-otp-button"
            value={otp}
            onChange={handleOtpChange}
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
        <InputFieldPassword
          password={newPassword}
          setPassword={setNewPassword}
          placeholder="Enter your new password"
          label="New Password"
          unstyled={unstyled}
          onChange={handlePasswordChange}
        />
        <InputFieldPassword
          password={confirmPassword}
          setPassword={setConfirmPassword}
          placeholder="Confirm your new password"
          label="Confirm New Password"
          showStrengthMeter={false}
          unstyled={unstyled}
        />
        <ButtonPrimary
          buttonLabel="Reset Password"
          type="submit"
          unstyled={unstyled}
          loading={passwordChanging}
        />
        <HypershipPoweredBy />
      </form>
    </div>
  );
};

export default PasswordChange;
