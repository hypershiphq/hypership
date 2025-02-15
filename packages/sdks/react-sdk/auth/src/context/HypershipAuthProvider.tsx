import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import apiClient from "../utils/apiClient";
import getHypershipPublicKey from "../utils/getPublicKey";
import { ToastProvider } from "../components/Common/Toast/ToastProvider";
import { AuthContextProps, User } from "../types/types";
import { Toast } from "../components/Common/Toast/Toast";

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
  apiKey?: string; // Make apiKey optional
  theme?: "light" | "dark"; // Optional theme prop with possible values
}

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split(";");
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("accessToken=")
  );
  return accessTokenCookie
    ? decodeURIComponent(accessTokenCookie.split("=")[1].trim())
    : null;
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1].trim()) : null;
};

const setCookie = (
  name: string,
  value: string | null,
  expirationDays: number = 15
) => {
  if (typeof window === "undefined") return;

  if (value) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expirationDate.toUTCString()}; secure; samesite=lax`;
  } else {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const HypershipAuthProvider: React.FC<AuthProviderProps> = ({
  children,
  apiKey,
  theme: initialTheme = "light", // Default to "light" if no theme is provided
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);
  const accessToken = getAccessToken();
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

  // Add toast state directly in this component
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

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
    // Store the public key in a cookie instead of localStorage
    setCookie("hs-public-key", resolvedApiKey, 365); // Store for 1 year

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
        return response.accessToken;
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

  const showErrorToast = (errorMessage: string) => {
    setToastMessage(errorMessage);
    setToastType("error");
    setShowToast(true);
  };

  const showSuccessToast = (successMessage: string) => {
    setToastMessage(successMessage);
    setToastType("success");
    setShowToast(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    showErrorToast(errorMessage);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
      setToastMessage(null);
    }, 6000);
  };

  const handleSuccess = (successMessage: string) => {
    showSuccessToast(successMessage);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
      setToastMessage(null);
    }, 6000);
  };

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

      // Set the access token in cookie
      setCookie("accessToken", accessToken);

      // Also set the refresh token if it's in the response
      if (response.refreshToken) {
        setCookie("refreshToken", response.refreshToken, 30);
      }

      setError(null);
    } catch (error: unknown) {
      console.error("Sign-in error:", error);
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === "error" &&
        "error" in error
      ) {
        const apiError = error as {
          error: { message?: string; code?: string };
        };
        handleError(
          apiError.error?.message ||
            "Sign-in failed. Please check your API key and try again."
        );
      } else {
        handleError("Sign-in failed. Please check your API key and try again.");
      }
      signOut();
      throw error;
    } finally {
      setSigningIn(false);
    }
  };

  const signInWithGithub = (): Promise<void> => {
    return new Promise(() => {
      const publicKey = getCookie("hs-public-key");

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
        handleError(response.error.message || "Sign-up failed.");
        throw response.error;
      } else {
        handleSuccess("Sign-up successful. Please confirm your account.");
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "error" in error) {
        const apiError = error as {
          error: { message?: string; code?: string };
        };
        if (apiError.error?.code === "USER_ALREADY_EXISTS") {
          handleError(apiError.error.message || "User already exists.");
        } else {
          handleError(apiError.error?.message || "Sign-up failed.");
        }
      } else {
        handleError("Sign-up failed.");
      }
      throw error;
    } finally {
      setSigningUp(false);
    }
  };

  // Sign-out method
  const signOut = async () => {
    // Clear all auth-related cookies
    setCookie("accessToken", null);
    setCookie("refreshToken", null);
    setCookie("hs-public-key", null);
    initializeAuthRan.current = false;
    setUser(null);
  };

  // This method actually changes the password, not triggers the password reset flow
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
      handleSuccess("Password changed successfully.");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "error" in error) {
        const apiError = error as { error: { message?: string } };
        setError(apiError.error?.message || "Password change failed.");
        handleError(apiError.error?.message || "Password change failed.");
      } else {
        setError("Password change failed.");
        handleError("Password change failed.");
      }
      throw error;
    } finally {
      setPasswordChanging(false);
    }
  };

  // This method triggers the password reset flow
  const passwordReset = async (email: string) => {
    setError(null);
    setPasswordResetting(true);
    try {
      await apiClient.post("/auth/forgotPassword", {
        username: email.toLowerCase(),
      });
      handleSuccess("Password reset email sent successfully.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Password reset failed.";
      handleError(errorMessage);
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

  const confirmAccount = async (email: string, code: string) => {
    setError(null);
    setConfirmingAccount(true);
    try {
      await apiClient.post("/auth/confirmAccount", {
        username: email.toLowerCase(),
        confirmationToken: code,
      });
      handleSuccess("Account confirmed successfully. You can now sign in.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "error" in error
          ? (error as { error: { message?: string } }).error?.message
          : "Account confirmation failed.";
      handleError(errorMessage || "Account confirmation failed.");
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
      handleSuccess("Confirmation code resent successfully.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "error" in error
          ? (error as { error: { message?: string } }).error?.message
          : "Resend confirmation failed.";
      handleError(errorMessage || "Resend confirmation failed.");
      throw error;
    } finally {
      setConfirmAccountCodeResending(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        signingIn,
        signingUp,
        authenticating,
        passwordResetting,
        passwordChanging,
        confirmingAccount,
        confirmAccountCodeResending,
        signIn,
        signUp,
        signOut,
        signInWithGithub,
        theme,
        toggleTheme,
        passwordReset,
        confirmPasswordResetCode,
        passwordChange,
        confirmAccount,
        confirmAccountCodeResend,
      }}
    >
      <ToastProvider>
        {children}
        {showToast && <Toast message={toastMessage} type={toastType} />}
      </ToastProvider>
    </AuthContext.Provider>
  );
};
