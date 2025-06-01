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

// Database interfaces
export interface DbDocument {
  _id?: string;
  userId?: string; // Automatically added for audit trails
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
}

export interface QueryOptions {
  where?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  skip?: number;
}

export interface DbResponse<T = any> {
  data: T | null;
  error?: string;
  success: boolean;
}

export interface DbListResponse<T = any> {
  data: T[];
  error?: string;
  success: boolean;
  count: number;
  message?: string;
}

// Configuration
let HYPERSHIP_API_BASE =
  process.env.HYPERSHIP_API_BASE || "http://localhost:3002";
let HYPERSHIP_SECRET_KEY = process.env.HYPERSHIP_SECRET_KEY || "";

/**
 * Initialize the database package with API configuration
 */
export function initDb(config: { apiBase?: string; secretKey: string }) {
  if (config.apiBase) {
    HYPERSHIP_API_BASE = config.apiBase;
  }
  HYPERSHIP_SECRET_KEY = config.secretKey;
}

/**
 * Extracts the bearer token from the Authorization header
 */
function extractBearerToken(authHeader?: string | null): string | null {
  if (!authHeader) return null;

  const cleanHeader = authHeader.trim();
  const bearerMatch = cleanHeader.match(/^(?:bearer|Bearer|BEARER)\s+(.+)$/i);

  if (!bearerMatch) return null;

  return bearerMatch[1].trim();
}

/**
 * Verifies and decodes a JWT token
 */
async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const [headerB64, payloadB64] = token.split(".");
    if (!headerB64 || !payloadB64) return null;

    const payloadJson = Buffer.from(payloadB64, "base64").toString();
    const payload = JSON.parse(payloadJson);

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Server-side authentication function
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
 * Next.js specific server-side authentication
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
        const authTokenMatch = cookies.match(/authToken=([^;]+)/);
        const accessTokenMatch = cookies.match(/accessToken=([^;]+)/);

        if (authTokenMatch) {
          finalAuthHeader = authTokenMatch[1];
        } else if (accessTokenMatch) {
          finalAuthHeader = accessTokenMatch[1];
        }
      }
    }

    return await authServer({
      headers: {
        authorization: finalAuthHeader || undefined,
        cookie: headersList.get("cookie") || undefined,
      },
    });
  } catch (error) {
    return {
      userId: null,
      tokenData: null,
      error: "Failed to access request headers",
    };
  }
}

/**
 * Makes authenticated API requests to Hypership backend
 */
async function makeAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!HYPERSHIP_SECRET_KEY) {
    throw new Error(
      "Hypership secret key not configured. Call initDb() first."
    );
  }

  const requestHeaders = {
    "Content-Type": "application/json",
    "hs-secret-key": HYPERSHIP_SECRET_KEY,
    ...options.headers,
  };

  return fetch(`${HYPERSHIP_API_BASE}${endpoint}`, {
    ...options,
    headers: requestHeaders,
  });
}

/**
 * Database Query Builder Class
 */
class DbQuery<T = any> {
  private collection: string;
  private options: QueryOptions = {};

  constructor(collection: string) {
    this.collection = collection;
  }

  /**
   * Add where conditions to the query
   */
  where(conditions: Record<string, any>): DbQuery<T> {
    this.options.where = { ...this.options.where, ...conditions };
    return this;
  }

  /**
   * Add sorting to the query
   */
  sort(sortOptions: Record<string, 1 | -1>): DbQuery<T> {
    this.options.sort = sortOptions;
    return this;
  }

  /**
   * Limit the number of results
   */
  limit(count: number): DbQuery<T> {
    this.options.limit = count;
    return this;
  }

  /**
   * Skip a number of results
   */
  skip(count: number): DbQuery<T> {
    this.options.skip = count;
    return this;
  }

  /**
   * Execute the query and return all matching documents
   */
  async exec(): Promise<DbListResponse<T>> {
    try {
      const queryParams = new URLSearchParams();
      if (this.options.where) {
        queryParams.append("where", JSON.stringify(this.options.where));
      }
      if (this.options.sort) {
        queryParams.append("sort", JSON.stringify(this.options.sort));
      }
      if (this.options.limit) {
        queryParams.append("limit", this.options.limit.toString());
      }
      if (this.options.skip) {
        queryParams.append("skip", this.options.skip.toString());
      }

      const response = await makeAuthenticatedRequest(
        `/v1/db/collection/${this.collection}?${queryParams.toString()}`
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        return {
          data: [],
          error: errorData.message || `HTTP ${response.status}`,
          success: false,
          count: 0,
        };
      }

      const result = await response.json();

      // Handle the actual API response format
      if (result.status === "success" && result.data) {
        const documents = result.data.documents || [];

        // Map documents to include _id and flatten the data structure
        const mappedDocuments = documents.map((doc: any) => ({
          _id: doc.id, // Map 'id' to '_id' for consistency
          ...doc.data, // Spread the actual document data
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        }));

        return {
          data: mappedDocuments,
          success: true,
          count: result.data.pagination?.total || mappedDocuments.length,
        };
      }

      // Fallback for unexpected format
      return {
        data: [],
        error: "Unexpected response format",
        success: false,
        count: 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
        count: 0,
      };
    }
  }

  /**
   * Find a document by ID
   */
  async find(id: string): Promise<DbResponse<T>> {
    try {
      const response = await makeAuthenticatedRequest(`/v1/db/document/${id}`);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        return {
          data: null,
          error: errorData.message || `HTTP ${response.status}`,
          success: false,
        };
      }

      const result = await response.json();

      // Handle the actual API response format
      if (result.status === "success" && result.data) {
        const doc = result.data;

        // Map document to include _id and flatten the data structure
        const mappedDocument = {
          _id: doc.id, // Map 'id' to '_id' for consistency
          ...doc.data, // Spread the actual document data
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };

        return {
          data: mappedDocument,
          success: true,
        };
      }

      return {
        data: null,
        error: "Unexpected response format",
        success: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }

  /**
   * Create a new document
   */
  async create(data: Omit<T, "_id">): Promise<DbResponse<T>> {
    try {
      // Get current user and add their ID as projectUserId
      const auth = await currentUser();
      const requestBody: any = {
        collection: this.collection,
        data: data,
      };

      // Add projectUserId if we have a current user
      if (auth.userId) {
        requestBody.projectUserId = auth.userId;
      }

      const response = await makeAuthenticatedRequest("/v1/db/create", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        return {
          data: null,
          error: errorData.message || `HTTP ${response.status}`,
          success: false,
        };
      }

      const result = await response.json();

      // Handle the actual API response format
      if (result.status === "success" && result.data) {
        const doc = result.data;

        // Map document to include _id and flatten the data structure
        const mappedDocument = {
          _id: doc.id, // Map 'id' to '_id' for consistency
          ...doc.data, // Spread the actual document data
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };

        return {
          data: mappedDocument,
          success: true,
        };
      }

      return {
        data: null,
        error: "Unexpected response format",
        success: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }

  /**
   * Create multiple documents
   */
  async createMany(dataArray: Omit<T, "_id">[]): Promise<DbListResponse<T>> {
    try {
      // Get current user and add their ID to all documents
      const auth = await currentUser();

      // Format documents according to the API specification
      const documents = dataArray.map((data) => {
        const document: any = {
          collection: this.collection,
          data: data,
        };

        // Add projectUserId if we have a current user
        if (auth.userId) {
          document.projectUserId = auth.userId;
        }

        return document;
      });

      const response = await makeAuthenticatedRequest("/v1/db/create-many", {
        method: "POST",
        body: JSON.stringify({
          documents: documents,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        return {
          data: [],
          error: errorData.message || `HTTP ${response.status}`,
          success: false,
          count: 0,
        };
      }

      const result = await response.json();

      // Handle the actual API response format
      if (result.status === "success" && result.data) {
        // The API returns count and message, not the actual documents
        return {
          data: [], // No documents returned from this endpoint
          success: true,
          count: result.data.count || 0,
          message: result.data.message,
        };
      }

      return {
        data: [],
        error: "Unexpected response format",
        success: false,
        count: 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
        count: 0,
      };
    }
  }

  /**
   * Update a document by ID (not implemented in backend yet)
   */
  async update(id: string, data: Partial<T>): Promise<DbResponse<T>> {
    return {
      data: null,
      error: "Update endpoint not implemented yet",
      success: false,
    };
  }

  /**
   * Delete a document by ID
   */
  async delete(id: string): Promise<DbResponse<boolean>> {
    try {
      const response = await makeAuthenticatedRequest(`/v1/db/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        return {
          data: false,
          error: errorData.message || `HTTP ${response.status}`,
          success: false,
        };
      }

      return {
        data: true,
        success: true,
      };
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }

  /**
   * Get the first document matching the query
   */
  async first(): Promise<DbResponse<T>> {
    const result = await this.limit(1).exec();

    if (!result.success) {
      return {
        data: null,
        error: result.error,
        success: false,
      };
    }

    return {
      data: result.data[0] || null,
      success: true,
    };
  }

  /**
   * Create a new document without automatic user tracking
   */
  async createWithoutUser(data: Omit<T, "_id">): Promise<DbResponse<T>> {
    try {
      const response = await makeAuthenticatedRequest("/v1/db/create", {
        method: "POST",
        body: JSON.stringify({
          collection: this.collection,
          data: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        return {
          data: null,
          error: errorData.message || `HTTP ${response.status}`,
          success: false,
        };
      }

      const result = await response.json();

      // Handle the actual API response format
      if (result.status === "success" && result.data) {
        const doc = result.data;

        // Map document to include _id and flatten the data structure
        const mappedDocument = {
          _id: doc.id, // Map 'id' to '_id' for consistency
          ...doc.data, // Spread the actual document data
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };

        return {
          data: mappedDocument,
          success: true,
        };
      }

      return {
        data: null,
        error: "Unexpected response format",
        success: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }

  /**
   * Create multiple documents without automatic user tracking
   */
  async createManyWithoutUser(
    dataArray: Omit<T, "_id">[]
  ): Promise<DbListResponse<T>> {
    try {
      // Format documents according to the API specification
      const documents = dataArray.map((data) => ({
        collection: this.collection,
        data: data,
      }));

      const response = await makeAuthenticatedRequest("/v1/db/create-many", {
        method: "POST",
        body: JSON.stringify({
          documents: documents,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        return {
          data: [],
          error: errorData.message || `HTTP ${response.status}`,
          success: false,
          count: 0,
        };
      }

      const result = await response.json();

      // Handle the actual API response format
      if (result.status === "success" && result.data) {
        // The API returns count and message, not the actual documents
        return {
          data: [], // No documents returned from this endpoint
          success: true,
          count: result.data.count || 0,
          message: result.data.message,
        };
      }

      return {
        data: [],
        error: "Unexpected response format",
        success: false,
        count: 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
        count: 0,
      };
    }
  }
}

/**
 * Handles auth headers for middleware
 */
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

/**
 * Main database interface - direct export
 */
export const db = <T = any>(collection: string) => new DbQuery<T>(collection);

/**
 * Legacy hypership object for backward compatibility
 */
export const hypership = {
  db: <T = any>(collection: string) => new DbQuery<T>(collection),
};

// Default export is the db function
export default db;
