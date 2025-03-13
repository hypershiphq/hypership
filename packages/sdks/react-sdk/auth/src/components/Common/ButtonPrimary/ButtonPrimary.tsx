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
      className="w-full py-3 bg-primary dark:bg-primary-dark text-white border-none rounded font-medium cursor-pointer transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : buttonLabel}
    </button>
  );
};
