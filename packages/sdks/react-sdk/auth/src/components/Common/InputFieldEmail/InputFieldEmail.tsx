import React from "react";

interface InputFieldEmailProps {
  email: string;
  setEmail: (email: string) => void;
  placeholder?: string;
  label?: string;
  theme?: "light" | "dark" | "system";
}

export const InputFieldEmail: React.FC<InputFieldEmailProps> = ({
  email,
  setEmail,
  placeholder = "Enter your email",
  label = "Email",
  theme,
}) => {
  return (
    <div>
      <div className="mb-4 w-full">
        <label
          htmlFor="email"
          className="block mb-2 font-medium text-gray-800 dark:text-gray-200"
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
          className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none transition-colors focus:border-primary dark:focus:border-primary-dark focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
        />
      </div>
    </div>
  );
};
