
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const routeInfo = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
    userAuth: !!user,
    isLoading,
  };

  return (
    <div className="fixed bottom-2 left-2 bg-black/80 text-white text-xs p-2 rounded z-50 max-w-xs">
      <div className="font-bold">Route Debug:</div>
      <div>Path: {routeInfo.pathname}</div>
      {routeInfo.search && <div>Search: {routeInfo.search}</div>}
      {routeInfo.hash && <div>Hash: {routeInfo.hash}</div>}
      <div>Auth: {routeInfo.userAuth ? '✓' : '✗'}</div>
      <div>Loading: {routeInfo.isLoading ? '⏳' : '✓'}</div>
      <button 
        onClick={() => console.log('Route Info:', routeInfo)}
        className="mt-1 px-2 py-1 bg-blue-600 rounded text-xs"
      >
        Log Details
      </button>
    </div>
  );
};

export default RouteDebugger;
