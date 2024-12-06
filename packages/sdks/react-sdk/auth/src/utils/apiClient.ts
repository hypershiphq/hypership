// Create a base URL for the API
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3002/v1";

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
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
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
};

const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    const requestOptions = {
      ...options,
      headers: {
        ...getHeaders(url),
        ...(options.headers || {}),
      },
    };

    let response = await fetch(`${BASE_URL}${url}`, requestOptions);

    // Handle token expiration
    if (
      response.status === 401 ||
      (response.status === 400 && (await this.isTokenExpired(response)))
    ) {
      try {
        const newToken = await handleTokenRefresh();
        // Retry original request with new token
        requestOptions.headers = {
          ...requestOptions.headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(`${BASE_URL}${url}`, requestOptions);
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
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
