import React, { useEffect, useState } from "react";
import sharedStyles from "../AuthComponents.module.css";
import { InputFieldPassword } from "../Common/InputFieldPassword/InputFieldPassword";
import { InputFieldEmail } from "../Common/InputFieldEmail/InputFieldEmail";
import { ButtonPrimary } from "../Common/ButtonPrimary/ButtonPrimary";
import { HypershipPoweredBy } from "../Common/HypershipPoweredBy/HypershipPoweredBy";
import { Alert } from "../Common/Alert/Alert";
import { ButtonSignInGitHub } from "../Common/ButtonSignInGitHub/ButtonSignInGitHub";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";

interface SignInProps {
  onSignInSuccess: () => void;
  onAccountConfirmationRequired?: (email: string) => void;
  unstyled?: boolean;
  buttonLabel?: string;
}

export const SignIn: React.FC<SignInProps> = ({
  onSignInSuccess,
  onAccountConfirmationRequired,
  unstyled = false,
  buttonLabel = "Sign In",
}) => {
  console.log(sharedStyles)
  const { signIn, isAuthenticated, error, signingIn, theme } =
    useHypershipAuth();
  const [email, setEmail] = useState<string>("crowson.j+test6@gmail.com");
  const [password, setPassword] = useState<string>("Password12");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      if (isAuthenticated) {
        onSignInSuccess();
      }
    } catch (err: any) {
      if (
        err.response?.data?.error?.code === "SIGN_IN_FAILED" &&
        err.response?.data?.error?.message === "User is not confirmed."
      ) {
        // Trigger the function prop to handle unconfirmed users
        onAccountConfirmationRequired && onAccountConfirmationRequired(email);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      onSignInSuccess();
    }
  }, [isAuthenticated, onSignInSuccess]);

  return (
    <div className={unstyled ? "" : sharedStyles["hypership-container"]}>
      <form
        className={unstyled ? "" : sharedStyles["hypership-form"]}
        onSubmit={handleSubmit}
      >
        <Alert message={error} type="error" unstyled={unstyled} />
        <InputFieldEmail
          email={email}
          setEmail={setEmail}
          placeholder="Enter your email"
          label="Email"
          unstyled={unstyled}
          theme={theme}
        />
        <InputFieldPassword
          password={password}
          setPassword={setPassword}
          placeholder="Enter your password"
          label="Password"
          unstyled={unstyled}
          showStrengthMeter={false}
          // theme={theme}
        />
        <ButtonPrimary
          buttonLabel={buttonLabel}
          type="submit"
          unstyled={unstyled}
          loading={signingIn}
        />
        <ButtonSignInGitHub buttonLabel="Sign In with GitHub" />
        <HypershipPoweredBy />
      </form>
    </div>
  );
};

export default SignIn;
