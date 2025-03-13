# Hypership Auth Examples

This directory contains examples of how to integrate the Hypership Auth React SDK in different frameworks.

## Examples

### React

The `react` directory contains a simple example of using Hypership Auth in a React application:

- `LoginPage.jsx`: Shows how to import the styles and use the AuthFlow component.

### Next.js

The `nextjs` directory demonstrates using Hypership Auth in a Next.js application with the App Router:

- `app/layout.js`: Shows how to import the styles at the app level and provide the auth context.
- `app/login/page.js`: Demonstrates a login page with the AuthFlow component.

## Important Steps for All Frameworks

1. **Import the styles:**

   ```jsx
   import "@hypership/auth-react/style.css";
   ```

2. **Provide the auth context:**

   ```jsx
   <HypershipAuthProvider apiKey="your-hypership-api-key">
     {/* Your app content */}
   </HypershipAuthProvider>
   ```

3. **Use the components directly:**

   ```jsx
   <AuthFlow onAuthSuccess={handleSuccess} />
   ```

4. **For dark mode support** (optional):

   ```jsx
   import { ThemeToggle } from "@hypership/auth-react";

   // Then in your component:
   <ThemeToggle />;
   ```

## Using the Examples

These examples are for reference only and show the proper way to import and use the Hypership Auth components with their styles. To use them in your own project, you would need to:

1. Install the package: `npm install @hypership/auth-react`
2. Configure with your Hypership API key
3. Adapt the examples to your application structure

For more detailed documentation, refer to the main README.md file in the repository root.
