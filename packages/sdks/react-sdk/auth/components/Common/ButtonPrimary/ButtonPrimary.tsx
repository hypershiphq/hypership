import React from "react";
import sharedStyles from "../../AuthComponents.module.css";
import Spinner from "../Spinner/Spinner";

interface ButtonPrimaryProps {
  buttonLabel: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  unstyled?: boolean;
  loading?: boolean;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  buttonLabel,
  onClick,
  type = "button",
  unstyled = false,
  loading = false,
}) => {
  return (
    <button
      className={unstyled ? "" : sharedStyles["hypership-button-primary"]}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : buttonLabel}
    </button>
  );
};

export default ButtonPrimary;
