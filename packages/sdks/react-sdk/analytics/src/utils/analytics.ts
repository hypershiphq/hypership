// src/analytics.ts
import { PageViewData } from "../types/types.js";
import { validateConfig } from "./validateConfig.js";
import { apiRequest } from "./apiClient.js";

class HypershipAnalytics {
  private publicKey: string = "";
  private isInitialized: boolean = false;

  public initialize(publicKey: string) {
    if (this.isInitialized) {
      console.warn("Hypership Analytics is already initialized.");
      return;
    }

    validateConfig(publicKey); // Ensures publicKey is provided
    this.publicKey = publicKey;

    this.isInitialized = true;
  }

  public logPageView(data: PageViewData) {
    if (!this.isInitialized) {
      console.error("Hypership Analytics is not initialized.");
      return;
    }

    apiRequest("/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "hs-public-key": this.publicKey,
      },
      body: JSON.stringify(data),
    }).catch((error: unknown) => {
      console.error("Error logging page view:", error);
    });
  }
}

export const hypershipAnalytics = new HypershipAnalytics();
