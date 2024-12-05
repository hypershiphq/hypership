// src/utils/apiClient.ts

let API_BASE_URL = "http://localhost:3002/v1"; // Default API base URL

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url;
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred.");
    } catch (e) {
      throw new Error("An error occurred while processing the response.");
    }
  }
};
