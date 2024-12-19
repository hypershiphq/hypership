# 🚀 Hypership Analytics React 🚀

Hypership Analytics is a powerful analytics library for your React applications. It provides a simple integration and a full monitoring dashboard via the Hypership Platform.

## Installation

```bash
npm install @hypership/analytics-react
```

## Usage

```
import { HypershipAnalyticsProvider } from '@hypership/analytics-react';

export default function App() {
  return (
    <HypershipAnalyticsProvider apiKey={HYPERSHIP_PUBLIC_KEY}>
      <div>
        <h1>Basic Example</h1>
      </div>
    </HypershipAnalyticsProvider>
  );
};
```

## API Key

You can provide your Hypership API Key in one of the following ways:

- Directly as an argument when initializing Hypership Analytics.
- As an environment variable named `HYPERSHIP_PUBLIC_KEY`.
- As an environment variable named `REACT_APP_HYPERSHIP_PUBLIC_KEY` if you're using Create React App.
- As an environment variable named `NEXT_PUBLIC_HYPERSHIP_PUBLIC_KEY` if you're using Next.js.

## License

MIT
