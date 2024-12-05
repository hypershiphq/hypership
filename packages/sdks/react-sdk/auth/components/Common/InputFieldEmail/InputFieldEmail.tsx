import React from "react";
import sharedStyles from "../../AuthComponents.module.css";

interface InputFieldEmailProps {
  email: string;
  setEmail: (email: string) => void;
  placeholder?: string;
  label?: string;
  unstyled?: boolean;
  theme?: "light" | "dark";
}

const InputFieldEmail: React.FC<InputFieldEmailProps> = ({
  email,
  setEmail,
  placeholder = "Enter your email",
  label = "Email",
  unstyled = false,
  theme,
}) => {
  const themeClass = theme ? `${theme}-theme` : "";

  return (
    <div className={themeClass}>
      <div className={unstyled ? "" : sharedStyles["hypership-input-group"]}>
        <label
          htmlFor="email"
          className={unstyled ? "" : sharedStyles["hypership-label"]}
        >
          {label}
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className={unstyled ? "" : sharedStyles["hypership-input"]}
        />
      </div>
    </div>
  );
};

export default InputFieldEmail;
