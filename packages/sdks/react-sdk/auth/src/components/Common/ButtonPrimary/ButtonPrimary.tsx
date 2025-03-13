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
      className="inline-flex items-center justify-center whitespace-nowrap mb-4 w-full text-sm font-medium h-9 px-4 py-1.5 rounded-md bg-primary dark:bg-purple-500 text-white shadow-sm hover:bg-primary/90 dark:hover:bg-purple-400 disabled:pointer-events-none disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:focus-visible:ring-purple-500/30"
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <div className="mr-2">
          <Spinner size={16} />
        </div>
      ) : null}
      {buttonLabel}
    </button>
  );
};
