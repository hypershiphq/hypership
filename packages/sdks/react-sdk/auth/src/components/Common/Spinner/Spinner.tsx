import React from "react";

interface SpinnerProps {
  size?: number; // Optional size prop to control spinner dimensions
}

const Spinner: React.FC<SpinnerProps> = ({ size = 22 }) => {
  return (
    <svg
      data-testid="spinner"
      className="animate-spin block text-current"
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        style={{ opacity: 0.2 }}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        style={{ opacity: 0.75 }}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="50"
        strokeDashoffset="30"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Spinner;
