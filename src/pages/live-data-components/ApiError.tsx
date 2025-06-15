
import React from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';

interface ApiErrorProps {
  message: string;
  onRetry: () => void;
}

const ApiError: React.FC<ApiErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="flex justify-center">
        <div className="bg-red-50 rounded-full p-4">
          <WifiOff className="h-12 w-12 text-red-500" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Connection Issue</h3>
        <p className="text-gray-600 max-w-md mx-auto">{message}</p>
        <p className="text-sm text-gray-500">
          This is typically due to API access restrictions in browser environments.
        </p>
      </div>
      <Button onClick={onRetry} variant="outline" className="mt-4">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
};

export default ApiError;
