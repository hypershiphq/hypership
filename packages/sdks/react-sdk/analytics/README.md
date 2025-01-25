# @hypership/analytics-react

<div align="center">
  <p>
    Hypership is a new platform to build, ship, and manage apps at warp-speed. We give you a full codebase deployed with user authentication, pageview analytics, event tracking, and deployments out of the box.
  </p>
  <p>
    Find out more at <a href="https://hypership.dev">hypership.dev</a>
  </p>

[![Join Our Discord](https://img.shields.io/badge/Join%20Our%20Discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/R2KHzFqGjN)

</div>

A powerful and lightweight analytics SDK for React applications, part of the Hypership platform.

## Installation

```bash
npm install @hypership/analytics-react
```

## Features

- 📊 Automatic page view tracking
- 🌍 Geolocation tracking via timezone
- 🔄 SPA route change detection
- 📱 User agent tracking
- 🔗 Referrer tracking
- ⚡ Zero-configuration setup
- 🎯 History API integration
- 🕒 Timestamp tracking
- 🌐 Cross-browser support
- 🔒 Secure data transmission

## Quick Start

1. Wrap your app with the `HypershipAnalyticsProvider`:

```jsx
import { HypershipAnalyticsProvider } from "@hypership/analytics-react";

function App() {
  return (
    <HypershipAnalyticsProvider apiKey="your-hypership-api-key">
      <YourApp />
    </HypershipAnalyticsProvider>
  );
}
```

## API Key Configuration

You can provide your Hypership API Key in one of the following ways:

- Directly as a prop when initializing the provider
- As an environment variable named `HYPERSHIP_PUBLIC_KEY`
- As an environment variable named `REACT_APP_HYPERSHIP_PUBLIC_KEY` (for Create React App)
- As an environment variable named `NEXT_PUBLIC_HYPERSHIP_PUBLIC_KEY` (for Next.js)

## Tracked Data

The analytics SDK automatically tracks the following data points:

| Data Point   | Description                            |
| ------------ | -------------------------------------- |
| currentPath  | Current page URL path                  |
| searchParams | URL search parameters                  |
| previousPath | Previously visited page path           |
| userAgent    | Browser and device information         |
| referrer     | Source of the page visit               |
| timestamp    | Time of the page view                  |
| title        | Page title                             |
| country      | User's country (derived from timezone) |

## Advanced Configuration

The SDK automatically handles:

- Single Page Application (SPA) route changes
- Browser history state changes
- Initial page load tracking
- Country detection from timezone

## License

ISC
