// src/utils/apiClient.ts

let API_BASE_URL = "https://backend-dev.hypership.dev/v1";

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url;
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    console.log("API Error Response:", response.status);

    // Create a custom error with additional properties
    const error = new Error("An error occurred.");
    (error as any).status = "error";
    (error as any).statusCode = response.status;

    throw error;
  }

  // No JSON response expected, just return if successful
  return;
};
