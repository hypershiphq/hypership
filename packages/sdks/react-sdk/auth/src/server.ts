import { headers } from "next/headers";

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

  return bearerMatch[1].trim();
}

/**
 * Verifies and decodes a JWT token
 * @param token The JWT token to verify
 * @param secret The secret key used to verify the signature
 * @returns The decoded payload or null if invalid
 */
async function verifyJWT(
  token: string,
  secret: string
): Promise<TokenPayload | null> {
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
 * @param secret The secret key used to verify the token signature
 * @returns Object containing the verified token data or null if invalid
 */
export async function authServer(
  request: { headers: { authorization?: string } } | string,
  secret: string
): Promise<AuthResult> {
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

    const verified = await verifyJWT(token, secret);

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
export async function currentUser(secret: string): Promise<AuthResult> {
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
        const authTokenMatch = cookies.match(/authToken=(Bearer\s+[^;]+)/);
        if (authTokenMatch) {
          finalAuthHeader = authTokenMatch[1];
        }
      }
    }

    return authServer(
      {
        headers: {
          authorization: finalAuthHeader || undefined,
        },
      },
      secret
    );
  } catch (error) {
    return {
      userId: null,
      tokenData: null,
      error: "Failed to access request headers",
    };
  }
}
