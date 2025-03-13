// src/hooks/useHypershipAuth.ts
import { useContext } from "react";
import { AuthContext } from "../context/HypershipAuthProvider";
import { User } from "../types/types";

export const useHypershipAuth = (): {
  signingIn: boolean;
  signingUp: boolean;
  authenticating: boolean;
  passwordResetting: boolean;
  passwordChanging: boolean;
  confirmingAccount: boolean;
  confirmAccountCodeResending: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  passwordReset: (email: string) => Promise<void>;
  confirmPasswordResetCode: (email: string, code: string) => Promise<string>;
  passwordChange: (
    email: string,
    newPassword: string,
    changePasswordToken: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  confirmAccount: (email: string, code: string) => Promise<void>;
  confirmAccountCodeResend: (email: string) => Promise<void>;
  error: string | null;
  theme: "light" | "dark" | "system";
  toggleTheme: () => void;
} => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "The useHypershipAuth Hook must be used within a HypershipAuthProvider"
    );
  }

  const {
    user,
    signOut,
    signIn,
    signUp,
    signInWithGithub,
    passwordReset,
    confirmAccount,
    confirmAccountCodeResend,
    confirmPasswordResetCode,
    passwordChange,
    signingIn,
    signingUp,
    authenticating,
    passwordResetting,
    passwordChanging,
    confirmingAccount,
    confirmAccountCodeResending,
    error,
    theme,
    toggleTheme,
  } = context;

  // Determine if the user is authenticated by checking if the user exists
  const isAuthenticated = !!user;

  return {
    signingIn,
    signingUp,
    authenticating,
    passwordResetting,
    passwordChanging,
    confirmingAccount,
    confirmAccountCodeResending,
    isAuthenticated,
    currentUser: user,
    signIn,
    signInWithGithub,
    signUp,
    passwordReset,
    confirmPasswordResetCode,
    passwordChange,
    signOut,
    confirmAccount,
    confirmAccountCodeResend,
    error,
    theme,
    toggleTheme,
  };
};
