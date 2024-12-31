import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import apiClient from "../utils/apiClient";
import getHypershipPublicKey from "../utils/getPublicKey";

import { AuthContextProps, User } from "../types/types";

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
  apiKey?: string; // Make apiKey optional
  theme?: "light" | "dark"; // Optional theme prop with possible values
}

export const HypershipAuthProvider: React.FC<AuthProviderProps> = ({
  children,
  apiKey,
  theme: initialTheme = "light", // Default to "light" if no theme is provided
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);
  const accessToken = localStorage.getItem("accessToken");
  const initializeAuthRan = useRef(false);

  // Resolve the API key, trying to get it from getHypershipPublicKey if not provided
  const resolvedApiKey = apiKey || getHypershipPublicKey();
  if (!resolvedApiKey) {
    throw new Error("HypershipAuthProvider: API key is required");
  }

  // Loading states
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [signingUp, setSigningUp] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(true);
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
      username:
        typeof userData.username === "string"
          ? userData.username.toLowerCase()
          : "",
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      enabled: userData.enabled,
      metadata:
        typeof userData.metadata === "string"
          ? JSON.parse(userData.metadata)
          : userData.metadata || {},
    };

    setUser(normalizedUser);
  };

  // Effect to handle initial authentication and token refresh
  useEffect(() => {
    localStorage.setItem("hs-public-key", resolvedApiKey);

    const isAccessTokenExpired = (token: string) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        return payload.exp * 1000 < Date.now();
      } catch (error) {
        console.error("Error decoding token:", error);
        return true;
      }
    };

    const refreshToken = async () => {
      try {
        const response = await apiClient.request("/auth/refresh", {
          method: "POST",
        });
        const { accessToken: newAccessToken } = response;
        localStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
      }
    };

    const initializeAuth = async () => {
      if (initializeAuthRan.current) return;

      initializeAuthRan.current = true;

      setAuthenticating(true);
      try {
        if (accessToken && isAccessTokenExpired(accessToken)) {
          try {
            await refreshToken();
          } catch (error) {
            signOut();
            setAuthenticating(false);
            return;
          }
        }

        const response = await apiClient.get("/auth/me");
        const userData = {
          id: response.user.id,
          username: response.user.username.toLowerCase(),
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          enabled: response.user.enabled,
          metadata: response.user.metadata,
        };
        setUserWithData(userData);
      } catch (error) {
        setError("Failed to authenticate. Please sign in again.");
        throw error;
      } finally {
        setAuthenticating(false);
      }
    };

    if (accessToken) {
      initializeAuth();
    } else {
      setAuthenticating(false);
    }

    // Add event listener for URL changes
    const handleUrlChange = () => {
      if (accessToken) {
        if (isAccessTokenExpired(accessToken)) {
          refreshToken().catch(() => signOut());
        }
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, [apiKey, accessToken]);

  const signIn = async (email: string, password: string): Promise<void> => {
    setSigningIn(true);
    try {
      const response = await apiClient.post("/auth/signin", {
        username: email.toLowerCase(),
        password,
      });

      const accessToken = response.accessToken;
      if (!accessToken) {
        throw new Error("No access token received");
      }

      localStorage.setItem("accessToken", accessToken);
      setError(null);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "error" in error) {
        const apiError = error as { error: { message?: string } };
        setError(apiError.error?.message || "Sign-in failed.");
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
    return new Promise(() => {
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
        username: email.toLowerCase(),
        password,
        name,
      });

      if (response.status === "error") {
        setError(response.error.message || "Sign-up failed.");
        throw response.error;
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "error" in error) {
        const apiError = error as {
          error: { message?: string; code?: string };
        };
        if (apiError.error?.code === "USER_ALREADY_EXISTS") {
          setError(apiError.error.message || "User already exists.");
        } else {
          setError(apiError.error?.message || "Sign-up failed.");
        }
      } else {
        setError("Sign-up failed.");
      }
      throw error;
    } finally {
      setSigningUp(false);
    }
  };

  // Sign-out method
  const signOut = async () => {
    localStorage.removeItem("accessToken");
    initializeAuthRan.current = false;
    setUser(null);
  };

  // Password reset method (renamed from resetPassword to passwordReset)
  const passwordReset = async (email: string) => {
    setError(null);
    setPasswordResetting(true);
    try {
      await apiClient.post("/auth/forgotPassword", {
        username: email.toLowerCase(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Password reset failed.");
      } else {
        setError("Password reset failed.");
      }
      throw error;
    } finally {
      setPasswordResetting(false);
    }
  };

  // Password reset verification method
  const confirmPasswordResetCode = async (email: string, code: string) => {
    setError(null);
    setPasswordChanging(true);
    try {
      const response = await apiClient.post("/auth/verifyResetCode", {
        username: email.toLowerCase(),
        resetCode: code,
      });
      return response.changePasswordToken;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "error" in error) {
        const apiError = error as { error: { message?: string } };
        setError(
          apiError.error?.message || "Verification code verification failed."
        );
      } else {
        setError("Verification code verification failed.");
      }
      throw error;
    }
  };

  // Password change method
  const passwordChange = async (
    email: string,
    newPassword: string,
    changePasswordToken: string
  ) => {
    setError(null);
    try {
      await apiClient.post("/auth/changePassword", {
        username: email.toLowerCase(),
        newPassword,
        changePasswordToken,
      });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "error" in error) {
        const apiError = error as { error: { message?: string } };
        setError(apiError.error?.message || "Password change failed.");
      } else {
        setError("Password change failed.");
      }
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
        username: email.toLowerCase(),
        confirmationToken: code,
      });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "error" in error) {
        const apiError = error as { error: { message?: string } };
        setError(apiError.error?.message || "Account confirmation failed.");
      } else {
        setError("Account confirmation failed.");
      }
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
        username: email.toLowerCase(),
      });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "error" in error) {
        const apiError = error as { error: { message?: string } };
        setError(apiError.error?.message || "Resend confirmation failed.");
      } else {
        setError("Resend confirmation failed.");
      }
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
