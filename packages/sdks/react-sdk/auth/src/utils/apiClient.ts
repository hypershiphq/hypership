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
  return cookie ? decodeURIComponent(cookie.split("=")[1].trim()) : null;
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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const publicKey = getPublicKey();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (publicKey) {
    headers["hs-public-key"] = publicKey;
  }

  // Add access token to all requests except refresh
  if (accessToken && !url?.includes("/auth/refresh")) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  } else if (refreshToken && url?.includes("/auth/refresh")) {
    headers["Authorization"] = `Bearer ${refreshToken}`;
  }

  return headers;
};

// Helper function to handle refresh token
const handleTokenRefresh = async () => {
  if (isRefreshing) {
    // Wait until refresh is complete
    while (isRefreshing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return getAccessToken();
  }

  isRefreshing = true;

  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } finally {
    isRefreshing = false;
  }
};

const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    const requestOptions: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        ...getHeaders(url),
        ...(options.headers || {}),
      },
    };

    let response = await fetch(`${BASE_URL}${url}`, requestOptions);

    // Handle token expiration and errors
    if (response.status === 400) {
      const errorData = await response.json();
      if (await this.isTokenExpired(response)) {
        try {
          const newToken = await handleTokenRefresh();
          // Retry original request with new token
          requestOptions.headers = {
            ...getHeaders(url),
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(`${BASE_URL}${url}`, requestOptions);
        } catch (error) {
          setAccessToken(null);
          throw error;
        }
      } else {
        throw errorData;
      }
    } else if (response.status === 401) {
      try {
        const newToken = await handleTokenRefresh();
        // Retry original request with new token
        requestOptions.headers = {
          ...getHeaders(url),
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(`${BASE_URL}${url}`, requestOptions);
      } catch (error) {
        setAccessToken(null);
        throw error;
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

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
