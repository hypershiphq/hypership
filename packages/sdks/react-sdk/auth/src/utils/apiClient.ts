// Create a base URL for the API
const BASE_URL = "https://backend.hypership.dev/v1";

// Flag to track if token refresh is in progress
let isRefreshing = false;

/**
 * Gets the access token from localStorage
 */
const getAccessToken = () => {
  if (typeof window === "undefined") return null; // Skip on server-side

  const token = localStorage.getItem("accessToken");
  console.debug(
    "[Hypership Auth] 🔑 Retrieved access token:",
    token ? "Present" : "Not found"
  );
  return token;
};

// Setup fetch interceptor if we're in a browser environment
if (typeof window !== "undefined") {
  console.debug("[Hypership Auth] 🎯 Initializing fetch interceptor");
  const originalFetch = window.fetch;

  window.fetch = async (url: RequestInfo | URL, options: RequestInit = {}) => {
    const token = getAccessToken();

    console.debug("[Hypership Auth] 🌐 Intercepted request:", {
      url: url.toString(),
      originalHeaders: options.headers,
      hasToken: !!token,
    });

    const headers = {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    };

    console.debug("[Hypership Auth] ✨ Modified headers:", {
      url: url.toString(),
      finalHeaders: headers,
    });

    const modifiedOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include" as RequestCredentials,
    };

    try {
      const response = await originalFetch(url, modifiedOptions);
      console.debug("[Hypership Auth] ✅ Request completed:", {
        url: url.toString(),
        status: response.status,
        ok: response.ok,
      });
      return response;
    } catch (error: unknown) {
      console.error("[Hypership Auth] ❌ Request failed:", {
        url: url.toString(),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  };
  console.debug(
    "[Hypership Auth] 🚀 Fetch interceptor initialized successfully"
  );
}

// Helper function to get headers with auth tokens
const getHeaders = (url?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const publicKey = localStorage.getItem("hs-public-key");
  const accessToken = getAccessToken();
  const refreshToken = localStorage.getItem("refreshToken");

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
    return localStorage.getItem("accessToken");
  }

  isRefreshing = true;

  try {
    const refreshToken = localStorage.getItem("refreshToken");
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
    localStorage.setItem("accessToken", data.accessToken);
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
          localStorage.removeItem("accessToken");
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
        localStorage.removeItem("accessToken");
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
