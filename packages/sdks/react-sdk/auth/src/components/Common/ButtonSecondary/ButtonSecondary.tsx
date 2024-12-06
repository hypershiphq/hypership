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
      className="hypership-button-secondary"
      disabled={loading}
    >
      <span className="button-content">
        {loading && <Spinner />}
        {buttonLabel}
      </span>
    </button>
  );
};
