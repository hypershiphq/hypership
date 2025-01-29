# React Cookie Consenter

A lightweight, customizable React component for cookie consent management. This component provides a clean and user-friendly way to obtain cookie consent from your website visitors.

## Features

- 🎨 Light and dark theme support
- 📱 Responsive design
- 🔧 Highly customizable
- 💾 Persistent consent storage
- 🎯 Custom callback functions
- 🌐 Position control (top/bottom)

## Installation

```bash
npm install @hypership/react-cookie-consenter
# or
yarn add @hypership/react-cookie-consenter
```

## Usage

```jsx
import { ReactCookieConsenter } from "@hypership/react-cookie-consenter";

function App() {
  return (
    <ReactCookieConsenter
      message="We use cookies to improve your experience."
      onAccept={() => console.log("Cookies accepted")}
      onDecline={() => console.log("Cookies declined")}
    />
  );
}
```

## Props

| Prop                | Type              | Default                                                 | Description                         |
| ------------------- | ----------------- | ------------------------------------------------------- | ----------------------------------- |
| `buttonText`        | string            | 'Accept'                                                | Text for the accept button          |
| `declineButtonText` | string            | 'Decline'                                               | Text for the decline button         |
| `message`           | string            | 'This website uses cookies to enhance your experience.' | The message to display              |
| `cookieName`        | string            | 'cookie-consent'                                        | Name of the cookie to store consent |
| `cookieExpiration`  | number            | 365                                                     | Days until cookie expires           |
| `position`          | 'top' \| 'bottom' | 'bottom'                                                | Position of the banner              |
| `theme`             | 'light' \| 'dark' | 'light'                                                 | Color theme of the banner           |
| `onAccept`          | () => void        | undefined                                               | Callback when cookies are accepted  |
| `onDecline`         | () => void        | undefined                                               | Callback when cookies are declined  |

## Examples

### Dark Theme

```jsx
<ReactCookieConsenter
  theme="dark"
  position="top"
  message="We value your privacy. Please accept cookies to continue."
  buttonText="I Accept"
  declineButtonText="No Thanks"
/>
```

### Custom Callbacks

```jsx
<ReactCookieConsenter
  onAccept={() => {
    // Initialize analytics
    console.log("Cookies accepted");
  }}
  onDecline={() => {
    // Disable analytics
    console.log("Cookies declined");
  }}
/>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Hypership
