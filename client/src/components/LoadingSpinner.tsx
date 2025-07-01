import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ message = "Loading...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700/30"></div>
        {/* Inner spinning gradient */}
        <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 border-r-purple-500"></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
      </div>
      <p className="mt-6 text-gray-300 animate-pulse font-medium">{message}</p>
      
      {/* Animated dots */}
      <div className="flex space-x-1 mt-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
