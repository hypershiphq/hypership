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
      className="bg-transparent border-none text-gray-500 dark:text-gray-400 cursor-pointer text-sm py-2 px-4 rounded transition-colors hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loading}
    >
      <span className="flex items-center gap-2 justify-center w-full relative">
        {loading && <Spinner />}
        {buttonLabel}
      </span>
    </button>
  );
};
