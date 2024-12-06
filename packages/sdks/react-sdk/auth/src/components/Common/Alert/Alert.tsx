import React from "react";

interface AlertProps {
  message: string | null;
  type: "success" | "error"; // Type of alert: success or error
}

export const Alert: React.FC<AlertProps> = ({ message, type }) => {
  if (!message) return null;

  // Determine the class based on alert type
  const alertClass =
    type === "success"
      ? "hypership-success-message"
      : "hypership-error-message";

  return <p className={alertClass}>{message}</p>;
};
