import React from "react";
import sharedStyles from "../../AuthComponents.module.css";

interface AlertProps {
  message: string | null;
  type: "success" | "error"; // Type of alert: success or error
  unstyled?: boolean;
}

const Alert: React.FC<AlertProps> = ({ message, type, unstyled = false }) => {
  if (!message) return null;

  // Determine the class based on alert type and unstyled prop
  const alertClass = !unstyled
    ? type === "success"
      ? sharedStyles["hypership-success-message"]
      : sharedStyles["hypership-error-message"]
    : "";

  return <p className={alertClass}>{message}</p>;
};

export default Alert;
