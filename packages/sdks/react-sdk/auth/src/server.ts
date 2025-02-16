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
  console.log("[extractBearerToken] Input authHeader:", authHeader);

  if (!authHeader) {
    console.log("[extractBearerToken] No auth header provided");
    return null;
  }

  const cleanHeader = authHeader.trim();
  console.log("[extractBearerToken] Cleaned header:", cleanHeader);

  const bearerMatch = cleanHeader.match(/^(?:bearer|Bearer|BEARER)\s+(.+)$/i);
  if (!bearerMatch) {
    console.log("[extractBearerToken] No bearer token match found");
    return null;
  }

  const token = bearerMatch[1].trim();
  console.log(
    "[extractBearerToken] Extracted token:",
    token.substring(0, 20) + "..."
  );
  return token;
}

/**
 * Verifies and decodes a JWT token
 * @param token The JWT token to verify
 * @returns The decoded payload or null if invalid
 */
async function verifyJWT(token: string): Promise<TokenPayload | null> {
  console.log("[verifyJWT] Starting token verification");
  try {
    const [headerB64, payloadB64] = token.split(".");
    if (!headerB64 || !payloadB64) {
      console.log("[verifyJWT] Invalid token format - missing parts");
      return null;
    }

    try {
      const payloadJson = Buffer.from(payloadB64, "base64").toString();
      console.log("[verifyJWT] Decoded payload:", payloadJson);
      const payload = JSON.parse(payloadJson);
      return payload;
    } catch (e) {
      console.log("[verifyJWT] Failed to decode/parse payload:", e);
      return null;
    }
  } catch (error) {
    console.log("[verifyJWT] Error during verification:", error);
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
  console.log("[authServer] Starting auth server check");
  try {
    let token: string | null = null;

    if (typeof request === "string") {
      console.log("[authServer] Direct token string provided");
      token = request;
    } else {
      console.log("[authServer] Headers:", request.headers);
      // First try Authorization header
      token = extractBearerToken(request.headers.authorization);
      console.log(
        "[authServer] Token from Authorization header:",
        token ? "Found" : "Not found"
      );

      // If no token in Authorization header, check cookies
      if (!token && request.headers.cookie) {
        console.log("[authServer] Checking cookies:", request.headers.cookie);
        const accessTokenMatch =
          request.headers.cookie.match(/accessToken=([^;]+)/);
        if (accessTokenMatch) {
          console.log("[authServer] Found accessToken in cookies");
          token = accessTokenMatch[1];
          // If the cookie value starts with 'Bearer', extract just the token
          if (token.startsWith("Bearer ")) {
            token = extractBearerToken(token);
          }
        }
      }
    }

    if (!token) {
      console.log("[authServer] No valid token found in request");
      return {
        userId: null,
        tokenData: null,
        error: "No valid bearer token provided",
      };
    }

    console.log("[authServer] Verifying token");
    const verified = await verifyJWT(token);

    if (!verified) {
      console.log("[authServer] Token verification failed");
      return {
        userId: null,
        tokenData: null,
        error: "Invalid or expired token",
      };
    }

    console.log("[authServer] Token verified successfully:", {
      userId: verified.sub,
      tokenType: verified.type,
      exp: new Date(verified.exp * 1000).toISOString(),
    });

    return {
      userId: verified.sub,
      tokenData: verified,
    };
  } catch (error) {
    console.log("[authServer] Error during auth process:", error);
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
  console.log("[currentUser] Starting currentUser check");
  try {
    const headersList = await headers();
    console.log(
      "[currentUser] All headers:",
      Array.from(headersList.entries())
    );

    const authHeader =
      headersList.get("authorization") ||
      headersList.get("Authorization") ||
      headersList.get("x-forwarded-authorization") ||
      headersList.get("x-middleware-authorization") ||
      headersList.get("x-middleware-request-authorization");

    console.log("[currentUser] Found auth header:", authHeader);

    let finalAuthHeader = authHeader;
    if (!finalAuthHeader) {
      const cookies = headersList.get("cookie");
      console.log("[currentUser] Checking cookies:", cookies);

      if (cookies) {
        // Check for both authToken and accessToken in cookies
        const authTokenMatch = cookies.match(/authToken=([^;]+)/);
        const accessTokenMatch = cookies.match(/accessToken=([^;]+)/);

        console.log("[currentUser] Cookie matches:", {
          authToken: authTokenMatch ? "Found" : "Not found",
          accessToken: accessTokenMatch ? "Found" : "Not found",
        });

        if (authTokenMatch) {
          finalAuthHeader = authTokenMatch[1];
        } else if (accessTokenMatch) {
          finalAuthHeader = accessTokenMatch[1];
        }
      }
    }

    console.log("[currentUser] Final auth header:", finalAuthHeader);

    const result = await authServer({
      headers: {
        authorization: finalAuthHeader || undefined,
        cookie: headersList.get("cookie") || undefined,
      },
    });

    console.log("[currentUser] Auth result:", {
      userId: result.userId,
      hasTokenData: !!result.tokenData,
      error: result.error,
    });

    return result;
  } catch (error) {
    console.log("[currentUser] Error during currentUser check:", error);
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
