import React, { useState } from "react";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";
import { InputFieldPassword } from "../Common/InputFieldPassword/InputFieldPassword";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";
import { Alert } from "../Common/Alert/Alert";

interface SignUpProps {
  onSignUpSuccess: (email: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
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

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await signUp(email, password);
      onSignUpSuccess(email);
    } catch (err: any) {
      console.log(err);
      setErrorMessage(
        err.response?.data?.error?.message ||
          "An error occurred during sign-up."
      );
    }
  };

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
        <InputFieldPassword
          password={password}
          setPassword={setPassword}
          placeholder="Enter your password"
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
        />
        <HypershipPoweredBy />
      </form>
    </div>
  );
};
