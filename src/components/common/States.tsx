import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Cargando...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 space-y-3">
      <div className="flex items-gap-3 gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon = <AlertTriangle size={48} className="text-gray-400" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      {icon}
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};
