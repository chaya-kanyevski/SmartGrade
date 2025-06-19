import React, { createContext, useState, useCallback, useContext } from "react";
import Toast from "@/components/ui/Toast";

type ToastType = "success" | "error";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>("success");

  const showToast = useCallback((msg: string, t: ToastType = "success") => {
    setMessage(msg);
    setType(t);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <Toast
          message={message}
          type={type}
          onClose={() => setMessage(null)}
        />
      )}
    </ToastContext.Provider>
  );
};
