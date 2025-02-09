import { Request, Response, NextFunction } from 'express';

interface HypershipAuthOptions {
  apiUrl?: string;
  publicKey?: string;
}

export interface HypershipUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  metadata: {};
  enabled: boolean;
  confirmed: boolean;
}

export interface HypershipRequest extends Request {
  user?: HypershipUser;
}

export const hypershipMiddleware = (options: HypershipAuthOptions = {}) => {
  const apiUrl = options.apiUrl || 'https://backend-dev.hypership.dev/v1';
  const publicKey = options.publicKey || process.env.HYPERSHIP_PUBLIC_KEY;

  if (!publicKey) {
    console.warn('Hypership: No public key provided. Authentication will be disabled.');
  }

  return async (req: HypershipRequest, res: Response, next: NextFunction) => {
    try {
      if (!publicKey) {
        next();
        return;
      }

      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        next();
        return;
      }

      const token = authHeader.split(' ')[1];

      // Validate token with Hypership API
      const response = await fetch(`${apiUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'hs-public-key': publicKey,
        }
      });

      if (!response.ok) {
        next();
        return;
      }

      const userData = await response.json();
      req.user = userData as HypershipUser;
      next();
    } catch (error) {
      // On any error, skip auth but allow request to continue
      next();
    }
  };
};

export const requireAuth = () => {
  return (req: HypershipRequest, res: Response, next: NextFunction) => {
    const signInUrl = process.env.HYPERSHIP_SIGN_IN_URL || '/';

    if (!req.user) {
      return res.redirect(signInUrl);
    }

    next();
  };
}; 