import { useCallback, useEffect, useState } from 'react';

type AlertType = 'success' | 'info' | 'warning' | 'error';

interface AlertState {
  type: AlertType;
  message: string;
  description?: string;
}

export function useAlert(autoHideDuration: number = 3000) {
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = useCallback((type: AlertType, message: string, description?: string) => {
    setAlert({ type, message, description });
    setShow(true);
  }, []);

  const hideAlert = useCallback(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [show, autoHideDuration]);

  return {
    show,
    alert,
    showAlert,
    hideAlert,
  };
}
 