// src/utils/apiClient.ts

let API_BASE_URL = "http://localhost:3002/v1"; // Default API base URL

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url;
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    console.log("API Error Response:", errorData);

    // Create a custom error with additional properties
    const error = new Error(errorData?.error?.message || "An error occurred.");
    (error as any).status = errorData?.status || "error";
    (error as any).error = errorData?.error || {};

    throw error;
  }

  return response.json();
};
