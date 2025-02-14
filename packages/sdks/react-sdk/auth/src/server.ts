import { headers } from "next/headers";

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
 * Extracts the bearer token from the Authorization header
 * @param authHeader The Authorization header value
 * @returns The bearer token or null if not found/invalid
 */
function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Verifies and decodes a JWT token
 * @param token The JWT token to verify
 * @param secret The secret key used to verify the signature
 * @returns The decoded payload or null if invalid
 */
function verifyJWT(token: string, secret: string): TokenPayload | null {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;

    // Decode payload
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    const parsed = JSON.parse(jsonPayload);

    // Verify required fields
    if (!parsed.sub || !parsed.type || !parsed.exp || !parsed.iat) {
      return null;
    }

    // Check expiration
    if (parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("[Debug] JWT verification failed:", error);
    return null;
  }
}

/**
 * Server-side authentication function that verifies and decodes the bearer token from a request
 * @param request The request object containing headers or a direct token string
 * @param secret The secret key used to verify the token signature
 * @returns Object containing the verified token data or null if invalid
 */
export function authServer(
  request: { headers: { authorization?: string } } | string,
  secret: string
): AuthResult {
  try {
    let token: string | null = null;

    if (typeof request === "string") {
      token = request;
    } else {
      token = extractBearerToken(request.headers.authorization);
    }

    if (!token) {
      return {
        userId: null,
        tokenData: null,
        error: "No valid bearer token provided",
      };
    }

    const verified = verifyJWT(token, secret);

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
 * @param secret The secret key used to verify the token signature
 * @returns Object containing the verified token data or null if invalid
 */
export async function authServerNextJs(secret: string): Promise<AuthResult> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    return authServer(
      {
        headers: {
          authorization: authHeader || undefined,
        },
      },
      secret
    );
  } catch (error) {
    console.error("[Debug] Error accessing headers:", error);
    return {
      userId: null,
      tokenData: null,
      error: "Failed to access request headers",
    };
  }
}
