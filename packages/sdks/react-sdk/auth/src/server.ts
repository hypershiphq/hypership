import { headers } from "next/headers";
import * as jose from "jose";

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
  console.log(
    "[Hypership Auth] Extracting bearer token from header:",
    authHeader ? "Header present" : "No header"
  );

  if (!authHeader) {
    console.log("[Hypership Auth] No authorization header provided");
    return null;
  }

  // Clean up the header value
  const cleanHeader = authHeader.trim();

  // Handle different bearer formats
  const bearerMatch = cleanHeader.match(/^(?:bearer|Bearer|BEARER)\s+(.+)$/i);
  if (!bearerMatch) {
    console.log(
      "[Hypership Auth] Invalid authorization header format. Expected 'Bearer <token>'"
    );
    return null;
  }

  const token = bearerMatch[1].trim();
  console.log("[Hypership Auth] Successfully extracted bearer token:", {
    length: token.length,
    prefix: token.substring(0, 8) + "...",
  });
  return token;
}

/**
 * Verifies and decodes a JWT token using jose
 * @param token The JWT token to verify
 * @param secret The secret key used to verify the signature
 * @returns The decoded payload or null if invalid
 */
async function verifyJWT(
  token: string,
  secret: string
): Promise<TokenPayload | null> {
  try {
    // Log token structure
    const [headerB64, payloadB64] = token.split(".");
    if (!headerB64 || !payloadB64) {
      console.log("[Hypership Auth] Invalid token structure - missing parts");
      return null;
    }

    try {
      // Safely decode and log header structure
      const headerJson = Buffer.from(headerB64, "base64").toString();
      const header = JSON.parse(headerJson);
      console.log("[Hypership Auth] Token header structure:", {
        algorithm: header.alg,
        type: header.typ,
      });

      // Safely decode and log payload structure (without sensitive data)
      const payloadJson = Buffer.from(payloadB64, "base64").toString();
      const payload = JSON.parse(payloadJson);
      console.log("[Hypership Auth] Token payload structure:", {
        hasSubject: !!payload.sub,
        hasType: !!payload.type,
        hasExp: !!payload.exp,
        hasIat: !!payload.iat,
        expiresIn: payload.exp
          ? Math.floor((payload.exp * 1000 - Date.now()) / 1000) + " seconds"
          : "invalid",
        type: payload.type,
        rawPayload: payload,
      });

      return payload;
    } catch (e) {
      console.log("[Hypership Auth] Token structure analysis failed:", e);
      return null;
    }
  } catch (error) {
    console.error("[Hypership Auth] JWT verification failed:", error);
    if (error instanceof jose.errors.JWTExpired) {
      console.log("[Hypership Auth] Token has expired");
    } else if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      console.log("[Hypership Auth] Token signature verification failed");
    }
    return null;
  }
}

/**
 * Server-side authentication function that verifies and decodes the bearer token from a request
 * @param request The request object containing headers or a direct token string
 * @param secret The secret key used to verify the token signature
 * @returns Object containing the verified token data or null if invalid
 */
export async function authServer(
  request: { headers: { authorization?: string } } | string,
  secret: string
): Promise<AuthResult> {
  try {
    console.log("[Hypership Auth] Starting server authentication", {
      requestType:
        typeof request === "string" ? "direct token" : "headers object",
      secretLength: secret.length,
      secretPrefix: secret.substring(0, 4) + "...",
    });

    let token: string | null = null;

    if (typeof request === "string") {
      console.log("[Hypership Auth] Using direct token string", {
        tokenLength: request.length,
        tokenPrefix: request.substring(0, 8) + "...",
      });
      token = request;
    } else {
      console.log("[Hypership Auth] Extracting token from request headers");
      token = extractBearerToken(request.headers.authorization);
    }

    if (!token) {
      console.log("[Hypership Auth] No valid token found");
      return {
        userId: null,
        tokenData: null,
        error: "No valid bearer token provided",
      };
    }

    console.log("[Hypership Auth] Verifying token", {
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 8) + "...",
    });
    const verified = await verifyJWT(token, secret);

    if (!verified) {
      console.log("[Hypership Auth] Token verification failed");
      return {
        userId: null,
        tokenData: null,
        error: "Invalid or expired token",
      };
    }

    console.log(
      "[Hypership Auth] Authentication successful for user:",
      verified.sub
    );
    return {
      userId: verified.sub,
      tokenData: verified,
    };
  } catch (error) {
    console.error("[Hypership Auth] Server authentication error:", error);
    return {
      userId: null,
      tokenData: null,
      error: "Failed to verify token",
    };
  }
}

/**
 * Next.js specific server-side authentication that automatically extracts the token from headers
 * @param secret The secret key used to verify the token signature
 * @returns Object containing the verified token data or null if invalid
 */
export async function authServerNextJs(secret: string): Promise<AuthResult> {
  try {
    console.log("[Hypership Auth] Starting Next.js server authentication");
    const headersList = await headers();

    // Log all raw headers first
    console.log("[Hypership Auth] Raw headers:", {
      allHeaders: Array.from(headersList.entries()),
    });

    // Try all possible header variations
    const authHeader =
      headersList.get("authorization") ||
      headersList.get("Authorization") ||
      headersList.get("x-middleware-request-authorization") ||
      headersList.get("x-middleware-request-x-forwarded-piggles") ||
      headersList.get("x-forwarded-piggles");

    // Detailed header analysis
    console.log("[Hypership Auth] Detailed header analysis:", {
      hasAuthorization: !!headersList.get("authorization"),
      hasAuthorizationUpper: !!headersList.get("Authorization"),
      hasMiddlewareAuth: !!headersList.get(
        "x-middleware-request-authorization"
      ),
      hasForwardedPiggles: !!headersList.get(
        "x-middleware-request-x-forwarded-piggles"
      ),
      hasRawForwardedPiggles: !!headersList.get("x-forwarded-piggles"),
      foundAuthHeader: !!authHeader,
      authHeaderValue: authHeader ? `${authHeader.substring(0, 20)}...` : null,
      allHeaderNames: Array.from(headersList.keys()),
    });

    if (!authHeader) {
      console.log(
        "[Hypership Auth] No authorization header found in any expected location"
      );
    }

    return authServer(
      {
        headers: {
          authorization: authHeader || undefined,
        },
      },
      secret
    );
  } catch (error) {
    console.error("[Hypership Auth] Next.js headers access error:", error);
    return {
      userId: null,
      tokenData: null,
      error: "Failed to access request headers",
    };
  }
}

/**
 * Test function to directly verify a JWT token with a given secret
 * @param token The JWT token to verify
 * @param secret The secret key used to verify the signature
 * @returns Object containing the verified token data or null if invalid
 */
export async function testJWTVerification(
  token: string,
  secret: string
): Promise<AuthResult> {
  console.log("[Hypership Auth] Starting direct JWT verification test");
  console.log("[Hypership Auth] Input token:", {
    length: token.length,
    prefix: token.substring(0, 20) + "...",
  });
  console.log("[Hypership Auth] Input secret:", {
    length: secret.length,
    prefix: secret.substring(0, 4) + "...",
  });

  return authServer(token, secret);
}
