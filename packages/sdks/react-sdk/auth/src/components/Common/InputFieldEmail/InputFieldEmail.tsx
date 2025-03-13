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
          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-dark/20 focus:border-primary dark:focus:border-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};
