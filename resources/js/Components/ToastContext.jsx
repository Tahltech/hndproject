import React, { createContext, useContext, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

const ToastContext = createContext();

export function ToastProvider({ children, enableInertiaFlash = true }) {
  const [toasts, setToasts] = useState([]);

  let flashSuccess = null;
  let flashError = null;
  let flashErrors = {};

  try {
    if (enableInertiaFlash) {
      const { props } = usePage(); 
      flashSuccess = props.flash?.success;
      flashError = props.flash?.error;
      flashErrors = props.errors || {};
    }
  } catch (e) {
    //ignore if not uder inertia
  }

  // push Inertia messages into toast list (first render only)
  useEffect(() => {
    const newToasts = [];

    if (flashSuccess) newToasts.push({ type: "success", message: flashSuccess });
    if (flashError) newToasts.push({ type: "danger", message: flashError });

    Object.values(flashErrors).forEach((msg) => {
      newToasts.push({ type: "danger", message: msg });
    });

    if (newToasts.length > 0) {
      setToasts((prev) => [...prev, ...newToasts]);
    }
  }, [flashSuccess, flashError, flashErrors]);

  // Function to push Axios or manual messages into the same toast system
  const addToast = (message, type = "success") => {
    setToasts((prev) => [...prev, { message, type }]);
  };

  // Auto-remove toasts after 3 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
