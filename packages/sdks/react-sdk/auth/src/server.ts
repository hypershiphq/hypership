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
    "[extractBearerToken] Successfully extracted token:",
    token.substring(0, 10) + "..."
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
      console.log(
        "[verifyJWT] Invalid token format - missing header or payload"
      );
      return null;
    }

    try {
      const payloadJson = Buffer.from(payloadB64, "base64").toString();
      const payload = JSON.parse(payloadJson);
      console.log("[verifyJWT] Decoded payload:", {
        sub: payload.sub,
        type: payload.type,
        exp: new Date(payload.exp * 1000).toISOString(),
        iat: new Date(payload.iat * 1000).toISOString(),
        username: payload.username,
      });

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        console.log(
          "[verifyJWT] Token is expired. Expiry:",
          new Date(payload.exp * 1000).toISOString(),
          "Current:",
          new Date(now * 1000).toISOString()
        );
        return null;
      }

      return payload;
    } catch (e) {
      console.log("[verifyJWT] Failed to decode/parse payload:", e);
      return null;
    }
  } catch (error) {
    console.log("[verifyJWT] Token verification failed:", error);
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
  console.log("[authServer] Starting authentication");
  console.log(
    "[authServer] Request type:",
    typeof request === "string" ? "string" : "headers object"
  );

  try {
    let token: string | null = null;

    if (typeof request === "string") {
      console.log("[authServer] Using direct token input");
      token = request;
    } else {
      console.log("[authServer] Headers:", {
        authorization: request.headers.authorization ? "present" : "missing",
        cookie: request.headers.cookie ? "present" : "missing",
      });

      // First try Authorization header
      token = extractBearerToken(request.headers.authorization);
      console.log(
        "[authServer] Token from Authorization header:",
        token ? "found" : "not found"
      );

      // If no token in Authorization header, check cookies
      if (!token && request.headers.cookie) {
        console.log("[authServer] Checking cookies for token");
        const accessTokenMatch =
          request.headers.cookie.match(/accessToken=([^;]+)/);
        if (accessTokenMatch) {
          token = accessTokenMatch[1];
          console.log("[authServer] Found token in accessToken cookie");
          // If the cookie value starts with 'Bearer', extract just the token
          if (token.startsWith("Bearer ")) {
            console.log(
              "[authServer] Cookie token includes 'Bearer' prefix, extracting..."
            );
            token = extractBearerToken(token);
          }
        } else {
          console.log("[authServer] No accessToken found in cookies");
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

    console.log("[authServer] Verifying token...");
    const verified = await verifyJWT(token);

    if (!verified) {
      console.log("[authServer] Token verification failed");
      return {
        userId: null,
        tokenData: null,
        error: "Invalid or expired token",
      };
    }

    console.log(
      "[authServer] Authentication successful for user:",
      verified.sub
    );
    return {
      userId: verified.sub,
      tokenData: verified,
    };
  } catch (error) {
    console.error("[authServer] Authentication error:", error);
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
  console.log("[currentUser] Starting current user resolution");

  try {
    const headersList = await headers();
    console.log("[currentUser] Checking various authorization headers");

    const authHeader =
      headersList.get("authorization") ||
      headersList.get("Authorization") ||
      headersList.get("x-forwarded-authorization") ||
      headersList.get("x-middleware-authorization") ||
      headersList.get("x-middleware-request-authorization");

    console.log(
      "[currentUser] Found authorization header:",
      authHeader ? "yes" : "no"
    );

    let finalAuthHeader = authHeader;
    if (!finalAuthHeader) {
      const cookies = headersList.get("cookie");
      console.log(
        "[currentUser] No auth header, checking cookies:",
        cookies ? "present" : "missing"
      );

      if (cookies) {
        // Check for both authToken and accessToken in cookies
        const authTokenMatch = cookies.match(/authToken=([^;]+)/);
        const accessTokenMatch = cookies.match(/accessToken=([^;]+)/);

        console.log("[currentUser] Cookie matches:", {
          authToken: authTokenMatch ? "found" : "not found",
          accessToken: accessTokenMatch ? "found" : "not found",
        });

        if (authTokenMatch) {
          finalAuthHeader = authTokenMatch[1];
          console.log("[currentUser] Using authToken from cookies");
        } else if (accessTokenMatch) {
          finalAuthHeader = accessTokenMatch[1];
          console.log("[currentUser] Using accessToken from cookies");
        }
      }
    }

    console.log("[currentUser] Calling authServer with final headers");
    const result = await authServer({
      headers: {
        authorization: finalAuthHeader || undefined,
        cookie: headersList.get("cookie") || undefined,
      },
    });

    console.log("[currentUser] Auth result:", {
      success: !!result.userId,
      hasError: !!result.error,
    });
    return result;
  } catch (error) {
    console.error("[currentUser] Failed to access request headers:", error);
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
  console.log("[handleAuthHeaders] Starting header handling");

  const updatedHeaders = new Headers(headers);
  let authHeader = headers.get("Authorization");
  console.log(
    "[handleAuthHeaders] Initial auth header:",
    authHeader ? "present" : "missing"
  );

  if (authHeader) {
    console.log(
      "[handleAuthHeaders] Setting auth header to cookies and forwarded headers"
    );
    updatedHeaders.set(
      "Set-Cookie",
      `authToken=${authHeader}; HttpOnly; Secure; Path=/; SameSite=Lax`
    );
    updatedHeaders.set("x-forwarded-authorization", authHeader);
    updatedHeaders.set("x-middleware-authorization", authHeader);
  } else if (cookies) {
    console.log("[handleAuthHeaders] No auth header, checking cookies");
    const cookieArray = cookies.split("; ");
    const authTokenCookie = cookieArray.find((c) => c.startsWith("authToken="));
    const accessTokenCookie = cookieArray.find((c) =>
      c.startsWith("accessToken=")
    );

    console.log("[handleAuthHeaders] Cookie tokens:", {
      authToken: authTokenCookie ? "found" : "not found",
      accessToken: accessTokenCookie ? "found" : "not found",
    });

    if (authTokenCookie) {
      authHeader = authTokenCookie.split("=")[1];
      console.log("[handleAuthHeaders] Using authToken from cookies");
      updatedHeaders.set("x-forwarded-authorization", authHeader);
      updatedHeaders.set("x-middleware-authorization", authHeader);
    } else if (accessTokenCookie) {
      authHeader = accessTokenCookie.split("=")[1];
      console.log("[handleAuthHeaders] Using accessToken from cookies");
      updatedHeaders.set("x-forwarded-authorization", authHeader);
      updatedHeaders.set("x-middleware-authorization", authHeader);
    }
  }

  // Prevent browser caching from interfering with headers
  console.log("[handleAuthHeaders] Setting cache control headers");
  updatedHeaders.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  updatedHeaders.set("Pragma", "no-cache");
  updatedHeaders.set("Expires", "0");

  return updatedHeaders;
}
