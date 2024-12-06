import React, { createContext, useState, useEffect, ReactNode } from "react";
import apiClient from "../utils/apiClient";
import { AuthContextProps, User } from "../types/types";

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
  apiKey: string;
  theme?: "light" | "dark"; // Optional theme prop with possible values
}

export const HypershipAuthProvider: React.FC<AuthProviderProps> = ({
  children,
  apiKey,
  theme: initialTheme = "light", // Default to "light" if no theme is provided
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  // Loading states
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [signingUp, setSigningUp] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [passwordResetting, setPasswordResetting] = useState<boolean>(false);
  const [passwordChanging, setPasswordChanging] = useState<boolean>(false);
  const [confirmingAccount, setConfirmingAccount] = useState<boolean>(false);
  const [confirmAccountCodeResending, setConfirmAccountCodeResending] =
    useState<boolean>(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Helper function to normalize user data
  const setUserWithData = (userData: User) => {
    const normalizedUser: User = {
      id: userData.id,
      email:
        typeof userData.email === "string" ? userData.email : userData.email,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      enabled: userData.enabled,
      metadata: userData.metadata || {},
    };
    setUser(normalizedUser);
  };

  // Effect to handle initial authentication (on app load)
  useEffect(() => {
    localStorage.setItem("hs-public-key", apiKey);

    const initializeAuth = async () => {
      setAuthenticating(true);
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const response = await apiClient.get("/auth/me");
          const userData = {
            id: response.data.user.id,
            email: response.data.user.username,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            enabled: response.data.user.enabled,
            metadata: response.data.user.metadata,
          };
          setUserWithData(userData);
        } catch (error) {
          setError("Failed to authenticate. Please sign in again.");
          throw error;
        }
      }
      setAuthenticating(false);
    };
    initializeAuth();
  }, [apiKey]);

  const signIn = async (email: string, password: string): Promise<void> => {
    console.log("Signing in with email:", email, "and password:", password);
    setSigningIn(true);
    try {
      const response = await apiClient.post("/auth/signin", {
        username: email,
        password,
      });
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUserWithData(response.data);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error && "response" in (error as any)) {
        const axiosError = error as any;
        setError(
          axiosError.response?.data?.error?.message || "Sign-in failed."
        );
      } else {
        setError("Sign-in failed.");
      }
      signOut();
      throw error;
    } finally {
      setSigningIn(false);
    }
  };

  const signInWithGithub = (): Promise<void> => {
    return new Promise((resolve) => {
      const publicKey = localStorage.getItem("hs-public-key");

      // Construct the OAuth URL with `hs-public-key` as a query parameter
      const oauthUrl = new URL("http://localhost:3002/v1/oauth/github");
      if (publicKey) {
        oauthUrl.searchParams.append("hs-public-key", publicKey);
      }

      // Redirect to the OAuth URL
      window.location.href = oauthUrl.toString();
    });
  };

  // Sign-up method
  const signUp = async (email: string, password: string, name?: string) => {
    setSigningUp(true);
    setError(null);
    try {
      const response = await apiClient.post("/auth/signup", {
        username: email,
        password,
        name,
      });
      const signedUpUser = {
        id: response.data.userId,
        email: email, // Use the email passed to signUp since it's not in response
        firstName: "",
        lastName: "",
        enabled: true,
        metadata: {},
      };
      setUserWithData(signedUpUser);
    } catch (error: any) {
      setError(error.response?.data?.error?.message || "Sign-up failed.");
      throw error;
    } finally {
      setSigningUp(false);
    }
  };

  // Sign-out method
  const signOut = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    // setError(null);
  };

  // Password reset method (renamed from resetPassword to passwordReset)
  const passwordReset = async (email: string) => {
    setError(null);
    setPasswordResetting(true);
    try {
      await apiClient.post("/auth/forgotPassword", { username: email });
    } catch (error: any) {
      setError(error.response?.data?.message || "Password reset failed.");
      throw error;
    } finally {
      setPasswordResetting(false);
    }
  };

  // Password reset verification method
  const confirmPasswordResetCode = async (email: string, code: string) => {
    setError(null);
    try {
      const response = await apiClient.post("/auth/verifyResetCode", {
        username: email,
        resetCode: code,
      });
      return response.data.changePasswordToken;
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Verification code verification failed."
      );
      throw error;
    }
  };

  // Password change method
  const passwordChange = async (
    email: string,
    newPassword: string,
    changePasswordToken: string
  ) => {
    setPasswordChanging(true);
    setError(null);
    try {
      await apiClient.post("/auth/changePassword", {
        username: email,
        newPassword,
        changePasswordToken,
      });
    } catch (error: any) {
      setError(error.response?.data?.message || "Password change failed.");
      throw error;
    } finally {
      setPasswordChanging(false);
    }
  };

  const confirmAccount = async (email: string, code: string) => {
    setError(null);
    setConfirmingAccount(true);
    try {
      await apiClient.post("/auth/confirmAccount", {
        username: email,
        confirmationToken: code,
      });
    } catch (error: any) {
      setError(error.response?.data?.message || "Account confirmation failed.");
      throw error;
    } finally {
      setConfirmingAccount(false);
    }
  };

  const confirmAccountCodeResend = async (email: string) => {
    setConfirmAccountCodeResending(true);
    setError(null);
    try {
      await apiClient.post("/auth/resendConfirmation", {
        username: email,
      });
    } catch (error: any) {
      setError(error.response?.data?.message || "Resend confirmation failed.");
      throw error;
    } finally {
      setConfirmAccountCodeResending(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signingIn,
        signingUp,
        authenticating,
        passwordResetting,
        passwordChanging,
        confirmingAccount,
        error,
        signIn,
        signUp,
        signOut,
        passwordReset,
        confirmPasswordResetCode,
        passwordChange,
        confirmAccount,
        confirmAccountCodeResend,
        confirmAccountCodeResending,
        signInWithGithub,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
