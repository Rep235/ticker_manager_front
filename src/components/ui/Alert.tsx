import React from 'react';

interface AlertProps {
  type: 'error' | 'success' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

const typeStyles = {
  error: 'border-red-500/50 bg-red-500/10 text-red-700',
  success: 'border-green-500/50 bg-green-500/10 text-green-700',
  info: 'border-blue-500/50 bg-blue-500/10 text-blue-700',
  warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700',
};

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div className={`rounded-lg border p-4 space-y-2 ${typeStyles[type]}`}>
      <p className="text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-xs font-medium opacity-70 hover:opacity-100"
        >
          Cerrar
        </button>
      )}
    </div>
  );
};
