/// <reference types="vite/client" />

export const getHypershipPublicKey = (): string | undefined => {
  // Check if using Vite (import.meta.env)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env.VITE_HYPERSHIP_PUBLIC_KEY;
  }

  // Check for process.env variables (CRA, Next.js, etc.)
  if (typeof process !== "undefined" && process.env) {
    return (
      process.env.REACT_APP_HYPERSHIP_PUBLIC_KEY ||
      process.env.NEXT_PUBLIC_HYPERSHIP_PUBLIC_KEY ||
      process.env.HYPERSHIP_PUBLIC_KEY
    );
  }

  // Return undefined if no environment variables are found
  return undefined;
};
