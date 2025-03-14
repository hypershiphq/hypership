import React from "react";
import Spinner from "../Spinner/Spinner";

interface ButtonPrimaryProps {
  buttonLabel: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  highlightColor?: string;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  buttonLabel,
  onClick,
  type = "button",
  loading = false,
  highlightColor,
}) => {
  const buttonStyle = highlightColor ? { backgroundColor: highlightColor } : {};
  const ringColor = highlightColor
    ? { "--tw-ring-color": `${highlightColor}25` }
    : {};

  return (
    <button
      className="inline-flex items-center justify-center whitespace-nowrap mb-4 w-full text-sm font-medium h-9 px-4 py-1.5 rounded-md bg-primary dark:bg-blue-500 text-white shadow-sm hover:bg-primary/90 dark:hover:bg-blue-400 disabled:pointer-events-none disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:focus-visible:ring-blue-500/30"
      type={type}
      onClick={onClick}
      disabled={loading}
      style={
        {
          ...buttonStyle,
          ...ringColor,
        } as React.CSSProperties
      }
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
