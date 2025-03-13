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
      ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
      : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800";

  return (
    <p className={`mb-4 text-sm p-3 rounded text-center ${alertClass}`}>
      {message}
    </p>
  );
};
