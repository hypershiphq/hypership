// Create a base URL for the API
const BASE_URL = "https://backend.hypership.dev/v1";

// Promise to track ongoing token refresh
let refreshPromise: Promise<string | null> | null = null;

/**
 * Gets a cookie value by name
 */
const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null; // Skip on server-side

  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
  const value = cookie ? decodeURIComponent(cookie.split("=")[1].trim()) : null;
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
  if (typeof window === "undefined") return; // Skip on server-side

  if (value) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expirationDate.toUTCString()}; secure; samesite=lax`;
  } else {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
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
 * Gets the public key from cookies, fallback to environment variables
 */
const getPublicKey = () => {
  const cookieValue = getCookie("hs-public-key");
  if (cookieValue) return cookieValue;

  try {
    return (
      process.env.REACT_APP_HYPERSHIP_PUBLIC_KEY ||
      process.env.NEXT_PUBLIC_HYPERSHIP_PUBLIC_KEY ||
      process.env.HYPERSHIP_PUBLIC_KEY ||
      null
    );
  } catch (e) {
    // Silent fail
  }

  return null;
};

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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const publicKey = getPublicKey();
  const accessToken = getAccessToken();

  // Always include public key if available
  if (publicKey) {
    headers["hs-public-key"] = publicKey;
  }

  // Add access token to all requests except /auth/refresh
  if (accessToken && !url?.includes("/auth/refresh")) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return headers;
};

// Helper function to handle refresh token
const handleTokenRefresh = async () => {
  // If there's already a refresh in progress, return the existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  // Create new refresh promise
  refreshPromise = (async () => {
    try {
      const publicKey = getPublicKey();
      if (!publicKey) {
        throw new Error("Public key is required for refresh");
      }

      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Important: This ensures cookies are sent
        headers: {
          "Content-Type": "application/json",
          "hs-public-key": publicKey,
        },
        body: JSON.stringify({}), // Empty body but needed for POST request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || "Token refresh failed");
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      setAccessToken(null);
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Add this function to check if a token is expired
const isTokenExpired = (token: string): boolean => {
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
    return payload.exp < now;
  } catch (error) {
    return true; // If we can't decode the token, consider it expired
  }
};

const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    const makeRequest = async (token?: string) => {
      const headers: Record<string, string> = {
        ...getHeaders(url),
        ...Object.fromEntries(
          Object.entries(options.headers || {}).map(([k, v]) => [k, String(v)])
        ),
      };

      // If a token was passed, use it instead of getting from cookies
      // But skip for refresh requests as they use HTTP-only cookie
      if (token && !url?.includes("/auth/refresh")) {
        headers.Authorization = `Bearer ${token}`;
      } else if (url?.includes("/auth/refresh")) {
        // Remove any Authorization header for refresh requests
        delete headers.Authorization;
      }

      return fetch(`${BASE_URL}${url}`, {
        ...options,
        credentials: "include",
        headers,
      });
    };

    // Check if we need to refresh before making the request
    const currentToken = getAccessToken();
    if (currentToken && !url?.includes("/auth/refresh")) {
      if (isTokenExpired(currentToken)) {
        try {
          const newToken = await handleTokenRefresh();
          if (!newToken) {
            throw new Error("Failed to refresh token");
          }
          return makeRequest(newToken).then(async (response) => {
            if (!response.ok) {
              const error = await response.json();
              throw error;
            }
            return response.json();
          });
        } catch (error) {
          setAccessToken(null);
          throw error;
        }
      }
    }

    let response = await makeRequest();

    // Handle unexpected token expiration and errors
    if (response.status === 400 || response.status === 401) {
      const shouldRefresh =
        response.status === 401 ||
        (response.status === 400 && (await this.isTokenExpired(response)));

      if (shouldRefresh) {
        try {
          const newToken = await handleTokenRefresh();
          if (!newToken) {
            throw new Error("Failed to refresh token");
          }
          response = await makeRequest(newToken);
        } catch (error) {
          setAccessToken(null);
          throw error;
        }
      } else if (response.status === 400) {
        const errorData = await response.json();
        throw errorData;
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  // This is now for checking error responses only
  async isTokenExpired(response: Response) {
    try {
      const data = await response.clone().json();
      return (
        data.error?.code === "BAD_REQUEST" &&
        data.error?.message === "Token has expired."
      );
    } catch {
      return false;
    }
  },

  async get(url: string, options: RequestInit = {}) {
    return this.request(url, { ...options, method: "GET" });
  },

  async post(url: string, body?: any, options: RequestInit = {}) {
    return this.request(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async put(url: string, body?: any, options: RequestInit = {}) {
    return this.request(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  async delete(url: string, options: RequestInit = {}) {
    return this.request(url, { ...options, method: "DELETE" });
  },
};

export default apiClient;
