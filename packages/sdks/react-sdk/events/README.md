# 🚀 Hypership Events React 🚀

Hypership Analytics is a powerful analytics library for your React applications. It provides a simple integration and a full monitoring dashboard via the Hypership Platform.

## Installation

```bash
npm install @hypership/events-react
```

## Usage

```
import { HypershipEvents } from '@hypership/events-react';

// Initialize the package in your main App function
export default function App() {
  HypershipEvents();

  return (
    <>
      <div>
        <h1>Basic Example</h1>
      </div>
    </>
  );
};
```

## API Key

You can provide your Hypership API Key in one of the following ways:

- Directly as an argument when initializing Hypership Analytics.
- As an environment variable named `HYPERSHIP_API_KEY`.
- As an environment variable named `REACT_APP_HYPERSHIP_API_KEY` if you're using Create React App.
- As an environment variable named `NEXT_PUBLIC_HYPERSHIP_API_KEY` if you're using Next.js.

## License

MIT
