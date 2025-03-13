import React, { useState } from "react";

interface InputFieldPasswordProps {
  password: string;
  setPassword: (password: string) => void;
  placeholder?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showStrengthMeter?: boolean;
  id?: string;
}

// Shared state for password visibility across all instances
let isPasswordVisibleShared = false;
const passwordVisibilityListeners = new Set<(visible: boolean) => void>();

export const InputFieldPassword: React.FC<InputFieldPasswordProps> = ({
  password,
  setPassword,
  placeholder = "Enter your password",
  label = "Password",
  onChange,
  showStrengthMeter = true,
  id = "password",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  // Subscribe to shared visibility changes
  React.useEffect(() => {
    const listener = (visible: boolean) => {
      setIsPasswordVisible(visible);
    };
    passwordVisibilityListeners.add(listener);
    return () => {
      passwordVisibilityListeners.delete(listener);
    };
  }, []);

  const togglePasswordVisibility = () => {
    isPasswordVisibleShared = !isPasswordVisibleShared;
    // Notify all instances
    passwordVisibilityListeners.forEach((listener) => {
      listener(isPasswordVisibleShared);
    });
  };

  const evaluatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return Math.min(strength, 3);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(evaluatePasswordStrength(value));
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="mb-4 w-full">
      <label
        htmlFor={id}
        className="block mb-2 font-medium text-gray-800 dark:text-gray-200"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          data-testid="password-input"
          type={isPasswordVisible ? "text" : "password"}
          id={id}
          value={password}
          onChange={handleChange}
          placeholder={placeholder}
          required
          className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none transition-colors focus:border-primary dark:focus:border-primary-dark focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2.5 bg-transparent border-0 cursor-pointer p-0 outline-none"
          aria-label="Toggle password visibility"
          tabIndex={-1}
        >
          {!isPasswordVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </button>
      </div>
      {showStrengthMeter && (
        <div data-testid="password-strength-bar" className="flex gap-1 mt-2">
          <div
            data-testid="password-strength-bar-1"
            className={`h-1.5 flex-1 rounded transition-all ${
              passwordStrength >= 1
                ? passwordStrength === 3
                  ? "bg-green-500 opacity-100"
                  : passwordStrength === 2
                    ? "bg-yellow-500 opacity-100"
                    : "bg-red-500 opacity-100"
                : "bg-gray-200 dark:bg-gray-700 opacity-30"
            }`}
          ></div>
          <div
            data-testid="password-strength-bar-2"
            className={`h-1.5 flex-1 rounded transition-all ${
              passwordStrength >= 2
                ? passwordStrength === 3
                  ? "bg-green-500 opacity-100"
                  : "bg-yellow-500 opacity-100"
                : "bg-gray-200 dark:bg-gray-700 opacity-30"
            }`}
          ></div>
          <div
            data-testid="password-strength-bar-3"
            className={`h-1.5 flex-1 rounded transition-all ${
              passwordStrength === 3
                ? "bg-green-500 opacity-100"
                : "bg-gray-200 dark:bg-gray-700 opacity-30"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};
