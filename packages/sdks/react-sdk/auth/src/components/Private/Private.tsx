import React, { useEffect } from "react";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";

interface PrivateProps {
  children: React.ReactNode;
  onUnauthorized?: () => void;
}

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split(";");
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("accessToken=")
  );
  return accessTokenCookie
    ? decodeURIComponent(accessTokenCookie.split("=")[1].trim())
    : null;
};

export const Private: React.FC<PrivateProps> = ({
  children,
  onUnauthorized,
}) => {
  const { isAuthenticated, authenticating } = useHypershipAuth();

  useEffect(() => {
    // Only call onUnauthorized after initial authentication is complete
    if (
      !authenticating &&
      !isAuthenticated &&
      onUnauthorized &&
      !getAccessToken()
    ) {
      onUnauthorized();
    }
  }, [authenticating, isAuthenticated, onUnauthorized]);

  // Render nothing while authentication status is being determined
  if (authenticating) {
    return null;
  }

  // Render children only if user is authenticated
  return isAuthenticated ? <>{children}</> : null;
};
