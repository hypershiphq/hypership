import React from "react";
import Spinner from "../Spinner/Spinner";

interface ButtonPrimaryProps {
  buttonLabel: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  buttonLabel,
  onClick,
  type = "button",
  loading = false,
}) => {
  return (
    <button
      className="w-full bg-red-500 h-10 py-2 mb-4 bg-primary dark:bg-primary-dark text-white border-none rounded-md font-medium cursor-pointer flex items-center justify-center relative shadow-sm transition-all duration-200 ease-in-out hover:opacity-90 hover:shadow-md active:scale-[0.98] active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-primary/25 dark:focus:ring-primary-dark/25"
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size={20} />
        </span>
      ) : (
        buttonLabel
      )}
    </button>
  );
};
