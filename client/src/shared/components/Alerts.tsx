'use client'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600'
    },
    info: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-800',
      icon: Info,
      iconColor: 'text-sky-600'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 ${style.text}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function SuccessAlert({ message, title, onClose }: Omit<AlertProps, 'type'>) {
  return <Alert type="success" title={title} message={message} onClose={onClose} />;
}

export function ErrorAlert({ message, title, onClose }: Omit<AlertProps, 'type'>) {
  return <Alert type="error" title={title} message={message} onClose={onClose} />;
}

export function WarningAlert({ message, title, onClose }: Omit<AlertProps, 'type'>) {
  return <Alert type="warning" title={title} message={message} onClose={onClose} />;
}

export function InfoAlert({ message, title, onClose }: Omit<AlertProps, 'type'>) {
  return <Alert type="info" title={title} message={message} onClose={onClose} />;
}
