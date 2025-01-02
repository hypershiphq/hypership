import React, { createContext, useContext, ReactNode, useState } from "react";
import { Toast } from "./Toast";

interface ToastContextType {
  showToast: boolean;
  toastMessage: string | null;
  toastType: "success" | "error";
  setShowToast: (show: boolean) => void;
  setToastMessage: (message: string | null) => void;
  setToastType: (type: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  return (
    <ToastContext.Provider
      value={{
        showToast,
        toastMessage,
        toastType,
        setShowToast,
        setToastMessage,
        setToastType,
      }}
    >
      {children}
      {showToast && <Toast message={toastMessage} type={toastType} />}
    </ToastContext.Provider>
  );
};
