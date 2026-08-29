import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const LoadingState = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
    <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
    <p className="text-gray-400">{message}</p>
  </div>
);

export const ErrorState = ({ message = 'An error occurred', onRetry }: { message?: string, onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px] bg-red-900/10 rounded-2xl border border-red-900/20">
    <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
    <p className="text-red-400 mb-6">{message}</p>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry}>Try Again</Button>
    )}
  </div>
);

export const EmptyState = ({ title, message, actionText, onAction, icon: Icon = AlertCircle }: any) => (
  <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px] border border-dashed border-white/10 rounded-2xl">
    <Icon className="h-12 w-12 text-gray-500 mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 max-w-sm">{message}</p>
    {onAction && actionText && (
      <Button onClick={onAction}>{actionText}</Button>
    )}
  </div>
);
