// Create a base URL for the API
const BASE_URL = "https://backend.hypership.dev/v1";

// Flag to track if token refresh is in progress
let isRefreshing = false;

/**
 * Gets a cookie value by name
 */
const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null; // Skip on server-side

  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
  const value = cookie ? decodeURIComponent(cookie.split("=")[1].trim()) : null;
  console.log(`[getCookie] Getting ${name}:`, value ? "found" : "not found");
  return value;
};

/**
 * Sets a cookie with the given name and value
 */
const setCookie = (
  name: string,
  value: string | null,
  expirationDays: number = 15
) => {
  console.log(`[setCookie] Setting ${name}:`, value ? "value present" : "null");
  if (typeof window === "undefined") return; // Skip on server-side

  if (value) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expirationDate.toUTCString()}; secure; samesite=lax`;
    console.log(
      `[setCookie] Set ${name} with expiration:`,
      expirationDate.toISOString()
    );
  } else {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    console.log(`[setCookie] Cleared ${name} cookie`);
  }
};

/**
 * Gets the access token from cookies
 */
const getAccessToken = () => getCookie("accessToken");

/**
 * Sets the access token as a cookie
 */
const setAccessToken = (token: string | null) =>
  setCookie("accessToken", token);

/**
 * Gets the public key from cookies
 */
const getPublicKey = () => getCookie("hs-public-key");

/**
 * Sets the public key as a cookie
 */
const setPublicKey = (key: string | null) =>
  setCookie("hs-public-key", key, 365); // Store for 1 year

/**
 * Gets the refresh token from cookies
 */
const getRefreshToken = () => getCookie("refreshToken");

// Helper function to get headers with auth tokens
const getHeaders = (url?: string) => {
  console.log("[getHeaders] Getting headers for URL:", url);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const publicKey = getPublicKey();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  console.log("[getHeaders] Tokens status:", {
    publicKey: publicKey ? "present" : "missing",
    accessToken: accessToken ? "present" : "missing",
    refreshToken: refreshToken ? "present" : "missing",
  });

  if (publicKey) {
    headers["hs-public-key"] = publicKey;
  }

  // Add access token to all requests except refresh
  if (accessToken && !url?.includes("/auth/refresh")) {
    headers["Authorization"] = `Bearer ${accessToken}`;
    console.log("[getHeaders] Using access token for authorization");
  } else if (refreshToken && url?.includes("/auth/refresh")) {
    headers["Authorization"] = `Bearer ${refreshToken}`;
    console.log("[getHeaders] Using refresh token for authorization");
  }

  return headers;
};

// Helper function to handle refresh token
const handleTokenRefresh = async () => {
  console.log(
    "[handleTokenRefresh] Starting token refresh, isRefreshing:",
    isRefreshing
  );

  if (isRefreshing) {
    console.log("[handleTokenRefresh] Refresh already in progress, waiting...");
    // Wait until refresh is complete and return the new token
    while (isRefreshing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const newToken = getAccessToken();
    if (!newToken) {
      console.log(
        "[handleTokenRefresh] No access token available after waiting for refresh"
      );
      throw new Error("No access token available after refresh");
    }
    console.log("[handleTokenRefresh] Got new token after waiting for refresh");
    return newToken;
  }

  isRefreshing = true;
  console.log("[handleTokenRefresh] Starting new token refresh");

  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.log("[handleTokenRefresh] No refresh token available");
      throw new Error("No refresh token available");
    }

    console.log("[handleTokenRefresh] Making refresh token request");
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      console.log(
        "[handleTokenRefresh] Refresh request failed:",
        response.status
      );
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    console.log(
      "[handleTokenRefresh] Refresh successful, setting new access token"
    );
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("[handleTokenRefresh] Error during refresh:", error);
    setAccessToken(null);
    throw error;
  } finally {
    console.log("[handleTokenRefresh] Completing refresh process");
    isRefreshing = false;
  }
};

// Add this function to check if a token is expired
const isTokenExpired = (token: string): boolean => {
  console.log("[isTokenExpired] Checking token expiration");
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < now;
    console.log("[isTokenExpired] Token expiration:", {
      expiry: new Date(payload.exp * 1000).toISOString(),
      current: new Date(now * 1000).toISOString(),
      isExpired,
    });
    return isExpired;
  } catch (error) {
    console.error("[isTokenExpired] Error checking expiration:", error);
    return true; // If we can't decode the token, consider it expired
  }
};

const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    console.log("[request] Starting request to:", url);

    const makeRequest = async (token?: string) => {
      console.log(
        "[makeRequest] Preparing request",
        token ? "with provided token" : "with default headers"
      );
      const headers: Record<string, string> = {
        ...getHeaders(url),
        ...Object.fromEntries(
          Object.entries(options.headers || {}).map(([k, v]) => [k, String(v)])
        ),
      };

      // If a token was passed, use it instead of getting from cookies
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log(
          "[makeRequest] Using provided token instead of cookie token"
        );
      }

      console.log("[makeRequest] Final request headers:", {
        url: `${BASE_URL}${url}`,
        method: options.method || "GET",
        hasAuthorization: !!headers.Authorization,
        hasPublicKey: !!headers["hs-public-key"],
      });

      return fetch(`${BASE_URL}${url}`, {
        ...options,
        credentials: "include",
        headers,
      });
    };

    // Check if we need to refresh before making the request
    const currentToken = getAccessToken();
    if (currentToken && !url?.includes("/auth/refresh")) {
      console.log("[request] Checking current token before request");
      if (isTokenExpired(currentToken)) {
        console.log("[request] Token is expired, refreshing before request");
        try {
          const newToken = await handleTokenRefresh();
          console.log("[request] Got new token, making request");
          return makeRequest(newToken).then(async (response) => {
            if (!response.ok) {
              const error = await response.json();
              console.log("[request] Request with new token failed:", error);
              throw error;
            }
            return response.json();
          });
        } catch (error) {
          console.error("[request] Error during pre-request refresh:", error);
          setAccessToken(null);
          throw error;
        }
      }
    }

    console.log("[request] Making initial request");
    let response = await makeRequest();

    // Handle unexpected token expiration and errors
    if (response.status === 400 || response.status === 401) {
      console.log("[request] Request failed with status:", response.status);
      const shouldRefresh =
        response.status === 401 ||
        (response.status === 400 && (await this.isTokenExpired(response)));

      if (shouldRefresh) {
        console.log("[request] Need to refresh token after failed request");
        try {
          const newToken = await handleTokenRefresh();
          console.log("[request] Retrying request with new token");
          response = await makeRequest(newToken);
        } catch (error) {
          console.error("[request] Error during post-request refresh:", error);
          setAccessToken(null);
          throw error;
        }
      } else if (response.status === 400) {
        const errorData = await response.json();
        console.log("[request] Bad request error:", errorData);
        throw errorData;
      }
    }

    if (!response.ok) {
      const error = await response.json();
      console.log("[request] Request failed:", error);
      throw error;
    }

    console.log("[request] Request successful");
    return response.json();
  },

  // This is now for checking error responses only
  async isTokenExpired(response: Response) {
    try {
      const data = await response.clone().json();
      const isExpired =
        data.error?.code === "BAD_REQUEST" &&
        data.error?.message === "Token has expired.";
      console.log(
        "[isTokenExpired] Checking response for token expiration:",
        isExpired
      );
      return isExpired;
    } catch {
      console.log(
        "[isTokenExpired] Failed to check response for token expiration"
      );
      return false;
    }
  },

  async get(url: string, options: RequestInit = {}) {
    console.log("[get] Making GET request to:", url);
    return this.request(url, { ...options, method: "GET" });
  },

  async post(url: string, body?: any, options: RequestInit = {}) {
    console.log("[post] Making POST request to:", url, "with body:", body);
    return this.request(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async put(url: string, body?: any, options: RequestInit = {}) {
    console.log("[put] Making PUT request to:", url, "with body:", body);
    return this.request(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  async delete(url: string, options: RequestInit = {}) {
    console.log("[delete] Making DELETE request to:", url);
    return this.request(url, { ...options, method: "DELETE" });
  },
};

export default apiClient;
