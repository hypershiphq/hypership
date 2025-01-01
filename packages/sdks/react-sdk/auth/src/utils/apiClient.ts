// Create a base URL for the API
const BASE_URL = "https://backend.hypership.dev/v1";

// Flag to track if token refresh is in progress
let isRefreshing = false;

// Helper function to get headers with auth tokens
const getHeaders = (url?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const publicKey = localStorage.getItem("hs-public-key");
  const accessToken = localStorage.getItem("accessToken");

  if (publicKey) {
    headers["hs-public-key"] = publicKey;
  }

  // Skip adding access token for refresh token requests
  if (accessToken && !url?.includes("/auth/refresh")) {
    headers["Authorization"] = `Bearer ${accessToken}`;
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
