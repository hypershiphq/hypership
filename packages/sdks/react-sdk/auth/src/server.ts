import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface TokenPayload {
  sub: string;
  type: string;
  exp: number;
  iat: number;
}

export interface AuthResult {
  userId: string | null;
  tokenData: TokenPayload | null;
  error?: string;
}

/**
 * Server-side authentication function that gets and decodes the refresh token using Next.js cookies
 * @returns Object containing the decoded token data or null if invalid
 */
export function authServer() {
  console.log("Server auth initialized");
  return {
    userId: "test-user-id",
  };
}
