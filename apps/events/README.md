# 🚀 Hypership Events 🚀

Hypership Events is a package that allows you to easily track events in your web application. It provides a simple interface to track events and allows you to view them in the Hypership platform.

## Installation

```bash
npm install @hypership/events
```

## Usage

```
import { HypershipEvents } from '@hypership/events';

// Initialize the package and add it anywhere in your application
const events = HypershipEvents();

events.invoke('my-test-event', {
  // Add any data you want to track
  user: 'test-data'
});
```

## API Key
You can provide your Hypership API Key in one of the following ways:

 - Directly as an argument when initializing Hypership Analytics.
 - As an environment variable named `HYPERSHIP_API_KEY`.
 - As an environment variable named `REACT_APP_HYPERSHIP_API_KEY` if you're using Create React App.
 - As an environment variable named `NEXT_PUBLIC_HYPERSHIP_API_KEY` if you're using Next.js.

## License
MIT