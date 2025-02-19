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
  - [useHypershipAuth Hook](#usehypershipauth-hook)

## Installation

```bash
npm install @hypership/auth-react
```

## Features

- 🔐 Complete authentication flow (Sign In, Sign Up, Password Reset)
- 📧 Email verification and account confirmation
- 🔄 Password reset and change functionality
- 🌓 Built-in light/dark theme support
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
```

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

- `AuthFlow`: Complete authentication flow UI
- `AuthFlowPage`: Complete authentication flow UI with a page
- `SignIn`: Standalone sign-in component
- `SignUp`: Standalone sign-up component
- `PasswordReset`: Password reset flow
- `ConfirmUserAccount`: Account confirmation component
- `Private`: Protected route wrapper

## Theme Support

The SDK supports both light and dark themes out of the box:

```jsx
<HypershipAuthProvider apiKey="your-hypership-public-key" theme="dark">
  <YourApp />
</HypershipAuthProvider>
```

## Styling

To include the default styles in your application, import the CSS file:

```jsx
import "@hypership/auth-react/style";
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
