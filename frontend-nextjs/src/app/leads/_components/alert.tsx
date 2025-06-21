import React from 'react';
import { Alert } from 'antd';

interface AutoHideAlertProps {
  visible: boolean;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string;
  onClose?: () => void;
}

const AutoHideAlert: React.FC<AutoHideAlertProps> = ({
  visible,
  type,
  message,
  description,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <Alert
      type={type}
      message={message}
      description={description}
      showIcon
      closable
      onClose={onClose}
    />
  );
};

export default AutoHideAlert;
 