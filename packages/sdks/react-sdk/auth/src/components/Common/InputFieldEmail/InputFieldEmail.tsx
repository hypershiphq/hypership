import React from "react";

interface InputFieldEmailProps {
  email: string;
  setEmail: (email: string) => void;
  placeholder?: string;
  label?: string;
  theme?: "light" | "dark";
}

export const InputFieldEmail: React.FC<InputFieldEmailProps> = ({
  email,
  setEmail,
  placeholder = "Enter your email",
  label = "Email",
  theme,
}) => {
  const themeClass = theme ? `${theme}-theme` : "";

  return (
    <div className={themeClass}>
      <div className="hypership-input-group">
        <label htmlFor="email" className="hypership-label">
          {label}
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className="hypership-input"
        />
      </div>
    </div>
  );
};
