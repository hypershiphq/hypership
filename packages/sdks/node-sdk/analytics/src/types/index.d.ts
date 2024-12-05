declare module '@hypership/analytics' {
  import React from 'react';

  interface AnalyticsConfig {
    apiKey?: string;
  }

  const HypershipAnalytics: React.FC<AnalyticsConfig>;
  export { HypershipAnalytics };
}