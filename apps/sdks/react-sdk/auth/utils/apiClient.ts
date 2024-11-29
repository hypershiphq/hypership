import axios from "axios";

// Create an instance of Axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3002/v1", // Replace with your base URL
});

// Add request interceptor to include `hs-public-key` and `accessToken` in the headers
apiClient.interceptors.request.use(
  (config) => {
    const publicKey = localStorage.getItem("hs-public-key");
    const accessToken = localStorage.getItem("accessToken");

    if (publicKey) {
      config.headers["hs-public-key"] = publicKey;
    }

    // Skip adding access token for refresh token requests
    if (accessToken && !config.url?.includes("/auth/refresh")) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 ||
      (error.response?.status === 400 &&
        error.response?.data?.error?.code === "BAD_REQUEST" &&
        error.response?.data?.error?.message === "Token has expired.");

    if (error.response && isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await apiClient.post(
            "/auth/refresh",
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          localStorage.setItem("accessToken", data.accessToken);

          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          // Token refresh failed, sign out user
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // Let it fall through to error rejection
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
