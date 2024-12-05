import React from "react";
import sharedStyles from "../../AuthComponents.module.css";
import Spinner from "../Spinner/Spinner";

interface ButtonSecondaryProps {
  buttonLabel: string;
  onClick?: () => void;
  unstyled?: boolean;
  loading?: boolean;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  buttonLabel,
  onClick = () => {},
  unstyled = false,
  loading = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={unstyled ? "" : sharedStyles["hypership-button-secondary"]}
      disabled={loading}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {loading && <Spinner />}
        {buttonLabel}
      </span>
    </button>
  );
};

export default ButtonSecondary;
