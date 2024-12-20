// src/pageview.ts
import { PageViewData } from "../types/types.js";
import { validateConfig } from "./validateConfig.js";
import { apiRequest } from "./apiClient.js";

class HypershipAnalytics {
  private publicKey: string = "";
  private isInitialized: boolean = false;
  private lastPageView: string = "";

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

    // Create a unique key for this page view using path and timestamp
    const pageViewKey = `${data.currentPath}-${data.timestamp}`;

    // Check if this exact page view was already logged
    if (this.lastPageView === pageViewKey) {
      return;
    }

    // Update the last page view before making the request
    this.lastPageView = pageViewKey;

    const accessToken = localStorage.getItem("accessToken");

    apiRequest("/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "hs-public-key": this.publicKey,
        "hs-user-access-token": accessToken || "",
      },
      body: JSON.stringify(data),
    }).catch((error: unknown) => {
      console.error("Error logging page view:", error);
    });
  }
}

export const hypershipAnalytics = new HypershipAnalytics();
