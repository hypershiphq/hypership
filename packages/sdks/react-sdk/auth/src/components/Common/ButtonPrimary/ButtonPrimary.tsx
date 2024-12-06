import React from "react";
import sharedStyles from "../../AuthComponents.module.css";
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
      className="hypership-button-primary"
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : buttonLabel}
    </button>
  );
};
