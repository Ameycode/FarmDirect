'use client';
import { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('FarmDirect Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-amber-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-sm border border-red-50">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Oops! Something broke.</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          We encountered an unexpected error while trying to load this page. Our team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </div>
  );
}
