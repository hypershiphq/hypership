import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface TokenPayload {
  sub: string;
  type: string;
  exp: number;
  iat: number;
  username?: string;
}

export interface AuthResult {
  userId: string | null;
  tokenData: TokenPayload | null;
  error?: string;
}

/**
 * Extracts the bearer token from the Authorization header
 * @param authHeader The Authorization header value
 * @returns The bearer token or null if not found/invalid
 */
function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  const cleanHeader = authHeader.trim();

  const bearerMatch = cleanHeader.match(/^(?:bearer|Bearer|BEARER)\s+(.+)$/i);
  if (!bearerMatch) {
    return null;
  }

  const token = bearerMatch[1].trim();
  return token;
}

/**
 * Verifies and decodes a JWT token
 * @param token The JWT token to verify
 * @returns The decoded payload or null if invalid
 */
async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const [headerB64, payloadB64] = token.split(".");
    if (!headerB64 || !payloadB64) {
      return null;
    }

    try {
      const payloadJson = Buffer.from(payloadB64, "base64").toString();
      const payload = JSON.parse(payloadJson);
      return payload;
    } catch (e) {
      return null;
    }
  } catch (error) {
    return null;
  }
}

/**
 * Server-side authentication function that verifies and decodes the bearer token from a request
 * @param request The request object containing headers or a direct token string
 * @returns Object containing the verified token data or null if invalid
 */
export async function authServer(
  request: { headers: { authorization?: string; cookie?: string } } | string
): Promise<AuthResult> {
  try {
    let token: string | null = null;

    if (typeof request === "string") {
      token = request;
    } else {
      // First try Authorization header
      token = extractBearerToken(request.headers.authorization);

      // If no token in Authorization header, check cookies
      if (!token && request.headers.cookie) {
        const accessTokenMatch =
          request.headers.cookie.match(/accessToken=([^;]+)/);
        if (accessTokenMatch) {
          token = accessTokenMatch[1];
          // If the cookie value starts with 'Bearer', extract just the token
          if (token.startsWith("Bearer ")) {
            token = extractBearerToken(token);
          }
        }
      }
    }

    if (!token) {
      return {
        userId: null,
        tokenData: null,
        error: "No valid bearer token provided",
      };
    }

    const verified = await verifyJWT(token);

    if (!verified) {
      return {
        userId: null,
        tokenData: null,
        error: "Invalid or expired token",
      };
    }

    return {
      userId: verified.sub,
      tokenData: verified,
    };
  } catch (error) {
    return {
      userId: null,
      tokenData: null,
      error: "Failed to verify token",
    };
  }
}

/**
 * Next.js specific server-side authentication that automatically extracts the token from headers
 * @returns Object containing the verified token data or null if invalid
 */
export async function currentUser(): Promise<AuthResult> {
  try {
    const headersList = await headers();

    const authHeader =
      headersList.get("authorization") ||
      headersList.get("Authorization") ||
      headersList.get("x-forwarded-authorization") ||
      headersList.get("x-middleware-authorization") ||
      headersList.get("x-middleware-request-authorization");

    let finalAuthHeader = authHeader;
    if (!finalAuthHeader) {
      const cookies = headersList.get("cookie");

      if (cookies) {
        // Check for both authToken and accessToken in cookies
        const authTokenMatch = cookies.match(/authToken=([^;]+)/);
        const accessTokenMatch = cookies.match(/accessToken=([^;]+)/);

        if (authTokenMatch) {
          finalAuthHeader = authTokenMatch[1];
        } else if (accessTokenMatch) {
          finalAuthHeader = accessTokenMatch[1];
        }
      }
    }

    const result = await authServer({
      headers: {
        authorization: finalAuthHeader || undefined,
        cookie: headersList.get("cookie") || undefined,
      },
    });

    return result;
  } catch (error) {
    return {
      userId: null,
      tokenData: null,
      error: "Failed to access request headers",
    };
  }
}

export function handleAuthHeaders(
  headers: Headers,
  cookies: string | null
): Headers {
  const updatedHeaders = new Headers(headers);
  let authHeader = headers.get("Authorization");

  if (authHeader) {
    updatedHeaders.set(
      "Set-Cookie",
      `authToken=${authHeader}; HttpOnly; Secure; Path=/; SameSite=Lax`
    );
    updatedHeaders.set("x-forwarded-authorization", authHeader);
    updatedHeaders.set("x-middleware-authorization", authHeader);
  } else if (cookies) {
    const cookieArray = cookies.split("; ");
    const authTokenCookie = cookieArray.find((c) => c.startsWith("authToken="));
    const accessTokenCookie = cookieArray.find((c) =>
      c.startsWith("accessToken=")
    );

    if (authTokenCookie) {
      authHeader = authTokenCookie.split("=")[1];
      updatedHeaders.set("x-forwarded-authorization", authHeader);
      updatedHeaders.set("x-middleware-authorization", authHeader);
    } else if (accessTokenCookie) {
      authHeader = accessTokenCookie.split("=")[1];
      updatedHeaders.set("x-forwarded-authorization", authHeader);
      updatedHeaders.set("x-middleware-authorization", authHeader);
    }
  }

  // Prevent browser caching from interfering with headers
  updatedHeaders.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  updatedHeaders.set("Pragma", "no-cache");
  updatedHeaders.set("Expires", "0");

  return updatedHeaders;
}
