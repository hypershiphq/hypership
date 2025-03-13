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
      ? "bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/30"
      : "bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/30";

  return (
    <div
      className={`mb-4 text-sm p-3 rounded-md border ${alertClass} shadow-sm animate-fadeIn transition-all duration-200`}
      role="alert"
    >
      <div className="flex items-center">
        {type === "success" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};
