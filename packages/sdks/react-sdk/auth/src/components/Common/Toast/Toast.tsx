import React from "react";

interface ToastProps {
  message: string | null;
  type: "success" | "error"; // Type of toast: success or error
  onClose?: () => void; // Optional callback for when the toast is closed
}

const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#A8D5BA" // Pastel green
    width="20px"
    height="20px"
    style={{ marginRight: "8px" }}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-1.2 17.4l-4.8-4.8 1.4-1.4 3.4 3.4 7.4-7.4 1.4 1.4-8.8 8.8z" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#F5A9A9" // Pastel red
    width="20px"
    height="20px"
    style={{ marginRight: "8px" }}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.3 16.3L16.3 17.3 12 13 7.7 17.3 6.7 16.3 11 12 6.7 7.7 7.7 6.7 12 11l4.3-4.3 1 1L13 12l4.3 4.3z" />
  </svg>
);

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  if (!message) return null;

  // Auto-dismiss the toast after 3 seconds
  React.useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  // Determine the class and icon based on toast type
  const toastClass =
    type === "success" ? "hypership-toast-success" : "hypership-toast-error";
  const Icon = type === "success" ? SuccessIcon : ErrorIcon;

  return (
    <div
      className={`hypership-toast ${toastClass}`}
      style={{ display: "flex", alignItems: "center" }}
      onClick={onClose} // Allow clicking the toast to dismiss it
    >
      <Icon /> {message}
    </div>
  );
};
