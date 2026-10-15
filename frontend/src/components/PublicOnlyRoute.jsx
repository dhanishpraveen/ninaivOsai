import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Loader2 } from 'lucide-react';

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F5EF] text-[#141A17] p-6">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="relative mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#073D2B] text-[#52D19D] shadow-lg border border-[#166E50]">
              <Sprout className="h-8 w-8 text-[#52D19D] animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F523B] border-2 border-[#F8F5EF] text-white">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#52D19D]" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-[#073D2B] tracking-tight">நினைவோசை</h2>
          <p className="text-xs text-[#525A56] font-tamil mt-1">
            ஏற்றப்படுகிறது...
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    const destination = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={destination} replace />;
  }

  return children;
}
