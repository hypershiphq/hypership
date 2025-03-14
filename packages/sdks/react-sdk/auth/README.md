# @hypership/auth-react

<div align="center">
  <p>
    Hypership is a new platform to build, ship, and manage apps at warp-speed. We give you a full codebase deployed with user authentication, pageview analytics, event tracking, and deployments out of the box.
  </p>
  <p>
    Find out more at <a href="https://hypership.dev">hypership.dev</a>
  </p>

[![Join Our Discord](https://img.shields.io/badge/Join%20Our%20Discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/R2KHzFqGjN)

</div>

A powerful and flexible authentication SDK for React applications, part of the Hypership platform.

## Contents

- [Installation](#installation)
- [Features](#features)
- [Quick Start](#quick-start)
- [Using the Hook](#using-the-hook)
- [Available Components](#available-components)
- [Theme Support](#theme-support)
- [Styling](#styling)
- [Using Current User Data](#using-current-user-data)
- [Server-Side Authentication](#server-side-authentication)
- [API Reference](#api-reference)
  - [HypershipAuthProvider Props](#hypershipauthprovider-props)
  - [AuthFlow Props](#authflow-props)
  - [AuthFlowPage Props](#authflowpage-props)
  - [useHypershipAuth Hook](#usehypershipauth-hook)

## Installation

```bash
npm install @hypership/auth-react
```

## Features

- 🔐 Complete authentication flow (Sign In, Sign Up, Password Reset)
- 📧 Email verification and account confirmation
- 🔄 Password reset and change functionality
- 🌓 Built-in light/dark theme support with Tailwind CSS
- 🚀 GitHub OAuth integration
- 🎨 Customizable UI components
- 🔒 Secure token management
- 🌐 Automatic token refresh
- 📱 Responsive design

## Quick Start

1. Wrap your app with the `HypershipAuthProvider`:

```jsx
import { HypershipAuthProvider } from "@hypership/auth-react";

function App() {
  return (
    <HypershipAuthProvider apiKey="your-hypership-api-key">
      <YourApp />
    </HypershipAuthProvider>
  );
}
```

2. Use the authentication flow component:

```jsx
import { AuthFlow } from "@hypership/auth-react";

function LoginPage() {
  const handleAuthSuccess = () => {
    // Handle successful authentication
  };

  return <AuthFlow onAuthSuccess={handleAuthSuccess} />;
}

// Or start with the sign up form:
function SignUpPage() {
  const handleAuthSuccess = () => {
    // Handle successful authentication
  };

  return <AuthFlow onAuthSuccess={handleAuthSuccess} initialView="signUp" />;
}
```

## Theme Support

The SDK now uses Tailwind CSS for styling and includes first-class support for dark mode:

```jsx
<HypershipAuthProvider apiKey="your-hypership-public-key">
  <YourApp />
</HypershipAuthProvider>
```

### Automatic Theme Detection

Our components will automatically detect and adapt to your app's theme:

1. **Tailwind Dark Mode**: If your app uses Tailwind's dark mode class on the HTML element
2. **next-themes**: If your app uses the popular `next-themes` package
3. **System Preference**: Falls back to the user's system preference

### ThemeToggle Component

Add a theme toggle button to your app with our built-in component:

```jsx
import { ThemeToggle } from "@hypership/auth-react";

function YourComponent() {
  return (
    <div>
      <h1>Your App</h1>
      <ThemeToggle />
    </div>
  );
}
```

### Theme Context

Access and control the theme directly:

```jsx
import { useTheme } from "@hypership/auth-react";

function YourComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
      <button onClick={() => setTheme("light")}>Light Mode</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}
```

### Dark Mode Helpers

Work with dark mode easily:

```jsx
import { useDarkMode } from "@hypership/auth-react";

function YourComponent() {
  const isDarkMode = useDarkMode();

  return (
    <div>{isDarkMode ? "Dark mode is active" : "Light mode is active"}</div>
  );
}
```

## Styling

Our components use Tailwind CSS for styling. If your project doesn't use Tailwind, don't worry - we bundle all the necessary styles.

### Importing Styles

To use our components with their styles, you only need to:

```jsx
// In your main entry file (e.g., _app.js, App.js, main.jsx)
import "@hypership/auth-react/style.css";
```

That's it! The necessary wrapper class is automatically included in the `HypershipAuthProvider`, so you don't need to add any additional wrappers.

```jsx
// This is all you need - no extra wrapper required!
<HypershipAuthProvider apiKey="your-hypership-api-key">
  <AuthFlow onAuthSuccess={handleSuccess} />
</HypershipAuthProvider>
```

### Using the AuthFlowPage Component

The `AuthFlowPage` component provides a complete, styled authentication page:

```jsx
import { AuthFlowPage } from "@hypership/auth-react";

function LoginPage() {
  return (
    <AuthFlowPage
      title="Welcome to My App"
      onAuthSuccess={handleSuccess}
      backgroundImage="/path/to/image.jpg" // Optional
    />
  );
}
```

### Dark Mode Support

Dark mode is handled automatically through the `ThemeProvider`:

```jsx
import { ThemeToggle } from "@hypership/auth-react";

function App() {
  return (
    <HypershipAuthProvider apiKey="your-hypership-api-key">
      <div>
        <ThemeToggle />
        <AuthFlow onAuthSuccess={handleSuccess} />
      </div>
    </HypershipAuthProvider>
  );
}
```

If your project already uses Tailwind CSS, our component styles will integrate seamlessly with your existing design system.

To ensure proper theming, make sure your app's HTML element has the `dark` class when dark mode is active. Our ThemeProvider handles this automatically.

## Using the Hook

Access authentication state and methods using the `useHypershipAuth` hook:

```jsx
import { useHypershipAuth } from "@hypership/auth-react";

function YourComponent() {
  const {
    currentUser,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    error,
    theme,
    toggleTheme,
  } = useHypershipAuth();

  // Use the authentication state and methods
}
```

## Available Components

- `AuthFlow`: Complete authentication flow UI with configurable initial view (sign in or sign up)
- `AuthFlowPage`: Complete authentication flow UI with a page and configurable initial view
- `SignIn`: Standalone sign-in component
- `SignUp`: Standalone sign-up component
- `PasswordReset`: Password reset flow
- `ConfirmUserAccount`: Account confirmation component
- `Private`: Protected route wrapper

### Using AuthFlow with initialView

You can choose which authentication view to show initially:

```jsx
import { AuthFlow } from "@hypership/auth-react";

// Start with sign in (default)
function LoginPage() {
  return <AuthFlow onAuthSuccess={handleSuccess} />;
}

// Start with sign up
function RegisterPage() {
  return <AuthFlow onAuthSuccess={handleSuccess} initialView="signUp" />;
}

// Start with password reset
function ResetPasswordPage() {
  // Optionally pre-populate the email
  return (
    <AuthFlow
      onAuthSuccess={handleSuccess}
      initialView="passwordReset"
      initialEmail="user@example.com" // Optional
    />
  );
}

// Start with account confirmation
function ConfirmAccountPage() {
  // You can pre-populate the email for a smoother experience
  return (
    <AuthFlow
      onAuthSuccess={handleSuccess}
      initialView="confirmAccount"
      initialEmail="user@example.com" // Optional
    />
  );
}
```

### Using AuthFlowPage with initialView

```jsx
import { AuthFlowPage } from "@hypership/auth-react";

// Sign in page
function SignInPage() {
  return (
    <AuthFlowPage
      title="Welcome Back"
      onAuthSuccess={handleSuccess}
      backgroundImage="/path/to/image.jpg" // Optional
    />
  );
}

// Registration page
function RegisterPage() {
  return (
    <AuthFlowPage
      title="Create an Account"
      onAuthSuccess={handleSuccess}
      initialView="signUp"
      backgroundImage="/path/to/image.jpg" // Optional
    />
  );
}

// Password reset page
function ResetPasswordPage() {
  return (
    <AuthFlowPage
      title="Reset Your Password"
      onAuthSuccess={handleSuccess}
      initialView="passwordReset"
      initialEmail="user@example.com" // Optional pre-filled email
      backgroundImage="/path/to/image.jpg" // Optional
    />
  );
}

// Account confirmation page
function ConfirmAccountPage() {
  // For verification after signup
  return (
    <AuthFlowPage
      title="Verify Your Account"
      onAuthSuccess={handleSuccess}
      initialView="confirmAccount"
      initialEmail="user@example.com" // Pre-fill the email for better UX
      backgroundImage="/path/to/image.jpg" // Optional
    />
  );
}
```

## Using Current User Data

You can access the current user's information using the `useHypershipAuth` hook:

```jsx
import { useHypershipAuth } from "@hypership/auth-react";

function Component() {
  const { currentUser } = useHypershipAuth();

  return (
    <>
      <div>ID: {currentUser?.id}</div>
      <div>Username: {currentUser?.username}</div>
      <div>First Name: {currentUser?.firstName}</div>
      <div>Last Name: {currentUser?.lastName}</div>
      <div>Enabled: {currentUser?.enabled}</div>
      <div>Metadata: {currentUser?.metadata}</div>
    </>
  );
}

export default Component;
```

## Server-Side Authentication

For server-side components and server actions in Next.js, you can use the `currentUser` function to verify authentication and get the current user's information:

```typescript
import { currentUser } from "@hypership/auth-react/server";

// Example of a Next.js Server Action
("use server");

interface Website {
  id: string;
  name: string;
  url: string;
  websiteUserId: string;
  createdAt: Date;
}

export async function getWebsites(): Promise<Website[]> {
  try {
    const user = await currentUser();

    if (!user?.userId) {
      return [];
    }

    const websites = await prisma.website.findMany({
      where: {
        websiteUserId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return websites;
  } catch {
    return [];
  }
}

// Example of using server-side auth in a Route Handler
export async function GET() {
  const user = await currentUser();

  if (!user?.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Perform authenticated operations
  const data = await fetchUserData(user.userId);
  return Response.json(data);
}
```

The `currentUser` function automatically handles token verification and returns an object containing:

- `userId`: The authenticated user's ID
- `tokenData`: Additional token information including expiration
- `error`: Any authentication errors that occurred

This makes it easy to protect server-side routes and actions while maintaining type safety and security.

## API Reference

### HypershipAuthProvider Props

| Prop     | Type              | Required | Description                         |
| -------- | ----------------- | -------- | ----------------------------------- |
| apiKey   | string            | Yes      | Your Hypership API key              |
| theme    | 'light' \| 'dark' | No       | Initial theme (defaults to 'light') |
| children | ReactNode         | Yes      | Child components                    |

### AuthFlow Props

| Prop          | Type                                                        | Required | Description                                                         |
| ------------- | ----------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| onAuthSuccess | () => void                                                  | Yes      | Callback function after successful authentication                   |
| initialView   | 'signIn' \| 'signUp' \| 'confirmAccount' \| 'passwordReset' | No       | Initial view to display (defaults to 'signIn')                      |
| initialEmail  | string                                                      | No       | Pre-populate email field for account confirmation or password reset |

### AuthFlowPage Props

| Prop            | Type                                                        | Required | Description                                                         |
| --------------- | ----------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| onAuthSuccess   | () => void                                                  | Yes      | Callback function after successful authentication                   |
| initialView     | 'signIn' \| 'signUp' \| 'confirmAccount' \| 'passwordReset' | No       | Initial view to display (defaults to 'signIn')                      |
| initialEmail    | string                                                      | No       | Pre-populate email field for account confirmation or password reset |
| title           | string                                                      | No       | Title displayed at the top of the page                              |
| backgroundImage | string                                                      | No       | URL or path to background image for the right side                  |
| rightComponent  | ReactNode                                                   | No       | Custom component to display on the right side                       |

### useHypershipAuth Hook

Returns an object with:

- Authentication State:

  - `currentUser`: Current user object or null
  - `isAuthenticated`: Boolean indicating auth status
  - `error`: Error message or null
  - `theme`: Current theme ('light' or 'dark')

- Loading States:

  - `signingIn`: Loading state for sign-in
  - `signingUp`: Loading state for sign-up
  - `authenticating`: Loading state for initial auth
  - `passwordResetting`: Loading state for password reset
  - `confirmingAccount`: Loading state for account confirmation

- Methods:
  - `signIn(email: string, password: string): Promise<void>`
  - `signUp(email: string, password: string): Promise<void>`
  - `signOut(): Promise<void>`
