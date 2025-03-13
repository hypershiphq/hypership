import React, { useState } from "react";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";
import { InputFieldPassword } from "../Common/InputFieldPassword/InputFieldPassword";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";

interface SignUpProps {
  onSignUpSuccess: (email: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  const { signUp, signingUp } = useHypershipAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    try {
      await signUp(email, password);
      onSignUpSuccess(email);
    } catch (err: any) {}
  };

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
