# @hypership/events-react

<div align="center">
  <p>
    Hypership is a new platform to build, ship, and manage apps at warp-speed. We give you a full codebase deployed with user authentication, pageview analytics, event tracking, and deployments out of the box.
  </p>
  <p>
    Find out more at <a href="https://hypership.dev">hypership.dev</a>
  </p>

[![Join Our Discord](https://img.shields.io/badge/Join%20Our%20Discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/R2KHzFqGjN)

</div>

A powerful and flexible event tracking SDK for React applications, part of the Hypership platform.

## Installation

```bash
npm install @hypership/events-react
```

## Features

- 🎯 Custom event tracking
- ⚡ Simple event logging API
- 🔄 Automatic timestamp tracking
- 🎨 Flexible event metadata
- 🔒 Secure event transmission
- 🌐 Cross-browser support
- 🚀 Zero-configuration setup
- 🔑 Automatic API key resolution
- 💾 Local storage integration
- ⚠️ Error handling and validation

## Quick Start

1. Wrap your app with the `HypershipEventsProvider`:

```jsx
import { HypershipEventsProvider } from "@hypership/events-react";

function App() {
  return (
    <HypershipEventsProvider apiKey="your-hypership-api-key">
      <YourApp />
    </HypershipEventsProvider>
  );
}
```

2. Use the events hook to track custom events:

```jsx
import { useHypershipEvents } from "@hypership/events-react";

function YourComponent() {
  const { trackEvent } = useHypershipEvents();

  const handleButtonClick = () => {
    trackEvent("button_clicked", {
      buttonId: "submit",
      page: "checkout",
      // Add any custom metadata
    });
  };

  return <button onClick={handleButtonClick}>Click Me</button>;
}
```

## API Key Configuration

You can provide your Hypership API Key in one of the following ways:

- Directly as a prop when initializing the provider
- As an environment variable named `HYPERSHIP_PUBLIC_KEY`
- As an environment variable named `REACT_APP_HYPERSHIP_PUBLIC_KEY` (for Create React App)
- As an environment variable named `NEXT_PUBLIC_HYPERSHIP_PUBLIC_KEY` (for Next.js)

## API Reference

### HypershipEventsProvider Props

| Prop     | Type      | Required | Description            |
| -------- | --------- | -------- | ---------------------- |
| apiKey   | string    | Yes      | Your Hypership API key |
| children | ReactNode | Yes      | Child components       |

### useHypershipEvents Hook

The hook returns an object with:

- `trackEvent(key: string, eventData: object): Promise<void>`
  - `key`: The event identifier
  - `eventData`: Object containing event metadata

## Event Data Structure

Each event consists of:

| Field     | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| eventKey  | string | Unique identifier for the event |
| metadata  | object | Custom event data               |
| timestamp | Date   | Automatically added             |

## Error Handling

The SDK includes built-in error handling for:

- Invalid API keys
- Network failures
- Invalid event keys
- Server errors

All errors are logged to the console with descriptive messages.

## License

ISC
