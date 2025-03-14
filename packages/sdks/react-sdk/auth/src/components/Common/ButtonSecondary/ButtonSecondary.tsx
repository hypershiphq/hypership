import React from "react";
import Spinner from "../Spinner/Spinner";

interface ButtonSecondaryProps {
  buttonLabel: string;
  onClick?: () => void;
  loading?: boolean;
}

export const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  buttonLabel,
  onClick = () => {},
  loading = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-9 px-4 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white disabled:pointer-events-none disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500"
      disabled={loading}
    >
      {loading ? (
        <div className="mr-2">
          <Spinner size={14} />
        </div>
      ) : null}
      {buttonLabel}
    </button>
  );
};
