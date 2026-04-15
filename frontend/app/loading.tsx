'use client';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-amber-50">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">
        Loading FarmDirect...
      </p>
    </div>
  );
}
