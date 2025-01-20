import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class HypershipClient {
  private client: AxiosInstance;
  private baseURL =
    import.meta.env.VITE_HYPERSHIP_CLI_API_URL ||
    "https://cli.hypership.dev/v1";

  constructor(private authToken?: string) {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: this.getHeaders(),
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            throw new Error("Unauthorized: Please login first");
          }
          throw new Error(data.message || "An error occurred");
        }
        throw error;
      },
    );
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  public setAuthToken(authToken: string) {
    this.authToken = authToken;
    this.client.defaults.headers["Authorization"] = `Bearer ${authToken}`;
  }

  async get<T = any>(path: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(path, config);
    return response.data;
  }

  async post<T = any>(path: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(path, data, config);
    return response.data;
  }

  async put<T = any>(path: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(path, data, config);
    return response.data;
  }

  async delete<T = any>(path: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(path, config);
    return response.data;
  }

  async patch<T = any>(path: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.patch<T>(path, data, config);
    return response.data;
  }
}

export const hypershipClient = new HypershipClient();
