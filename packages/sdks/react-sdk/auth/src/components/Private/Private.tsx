import React, { ReactNode, useEffect } from "react";
import { useHypershipAuth } from "../../hooks/useHypershipAuth";

type PrivateProps = {
  children: ReactNode;
  onUnauthorized?: () => void;
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
      !localStorage.getItem("accessToken")
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
